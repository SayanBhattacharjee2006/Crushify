import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";

const onlineUsers = new Map();

export const getOnlineUser = () => onlineUsers;

export const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            credentials: true,
        },
    });

    io.use(async (socket, next) => {
        try {
            console.log(socket.handshake);
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.headers?.authorization.split(" ")[1];

            if (!token) {
                return next(new Error("Authentication error"));
            }

            const payload = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(payload.userId);

            if (!user) {
                return next(new Error("Authentication error"));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.user._id.toString();

        socket.join(userId); //a room created using the user id triggered when a user logs in

        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }

        onlineUsers.get(userId).add(socket.id);

        io.emit("online_users", Array.from(onlineUsers.keys()));

        console.log(
            `🚀 ${socket.user.username} connected to socket room with socket id: ${socket.id}`,
        );

        // on the join_conversation event: a new conversation room is created
        socket.on("join_conversation", async (conversationId) => {
            try {
                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    participants: userId,
                });

                if (!conversation) {
                    socket.emit("error", { message: "Conversation not found" });
                }

                socket.join(conversationId);

                // as the user joins a conversation, the socket is added to the conversation room, make all the unread messages seen by the user

                await Message.updateMany(
                    {
                        conversationId: conversationId,
                        seenBy: { $ne: userId },
                        sender: { $ne: userId },
                    },
                    {
                        $addToSet: {
                            seenBy: userId,
                        },
                    },
                );

                socket.to(conversationId).emit("message_seen", {
                    conversationId,
                    seenBy: userId,
                });
            } catch (error) {
                console.error("Join conversation error: ", error?.message);
            }
        });

        socket.on("leave_conversation", (conversationId) => {
            socket.leave(conversationId);
        });

        socket.on("send_message", async ({ conversationId, content }) => {
            try {
                if(!content.trim())return;

                const conversation = await Conversation.findOne({
                    _id:conversationId,
                    participants:userId,
                })

                if(!conversation){
                    socket.emit("error", {
                        message:"Conversation not found",
                    })
                }

                const message = await Message.create({
                    conversationId,
                    content: content.trim(),
                    sender: userId,
                    seenBy: [userId],
                })

                const [_, populatedMessage] = await Promise.all([
                    Conversation.findByIdAndUpdate(conversationId, {
                        lastMessage: {
                            content: content.trim(),
                            seenBy:[userId],
                            sender: userId,
                            timestamp: new Date(),
                        }
                    }),
                    Message.findById(message._id).populate("sender", "fullname username avatarURL"),
                ])


                io.to(conversationId).emit("new_message",populatedMessage);

                // Also send the notification to all the user who are not in the conversation room

                conversation.participants.forEach((participantId)=>{
                    const pid = participantId.toString();
                    if(pid !== userId){
                        io.to(pid).emit("conversation_updated",{
                            conversationId,
                            lastMessage:{
                                content: content.trim(),
                                seenBy:[userId],
                                sender: userId,
                                timestamp: new Date(),
                            }
                        })
                    }
                })

            } catch (error) {
                console.log("Send message error: ", error?.message);
                socket.emit("error", { message: error?.message });
            }
        });

        socket.on("typing_start", async ({ conversationId }) => {
            socket.to(conversationId).emit("typing_start", {
                userId,
                conversationId,
            })
        });

        socket.on("typing_stop", async ({ conversationId }) => {
            socket.to(conversationId).emit("typing_stop", {
                userId,
                conversationId,
            })
        });

        socket.on("disconnect", () => {
            const sockets = onlineUsers.get(userId);
            if (socket) {
                sockets.delete(socket.id);

                if (sockets.size === 0) {
                    onlineUsers.delete(userId);
                }
            }

            io.emit("online_users",Array.from(onlineUsers.keys()));
            console.log(
                `🚀 ${socket.user.username} disconnected from socket room with socket id: ${socket.id}`,
            );
        });
    });

    return io;
};


// io.to().emit() // sends to everyone in a room including the sender
// socket.to().emit() // sends to everyone in a room excluding the sender