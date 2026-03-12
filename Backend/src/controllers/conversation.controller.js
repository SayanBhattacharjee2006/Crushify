import { Message } from "../model/message.model.js";
import { Conversation } from "../model/conversation.model.js";
import mongoose from "mongoose";

// POST /api/v1/conversations/id
// Get existing conversation with a user or create a new one

const getOrCreateConversation = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const { id: userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        if (currentUserId.toString() === userId.toString()) {
            return res
                .status(400)
                .json({
                    message: "You cannot start a conversation with yourself",
                });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, userId] },
        }).populate("participants", "fullname username avatarURL");

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [currentUserId, userId],
                lastMessage: {},
            });
            conversation = await Conversation.findById(
                conversation._id,
            ).populate("participants", "fullname username avatarURL");
        }

        return res.status(200).json({
            success: true,
            conversation,
            message: "Conversation found",
        });
    } catch (error) {
        console.log("GET CONVERSATION ERROR:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getAllConversations = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const conversations = await Conversation.find({
            participants: currentUserId,
        })
            .populate("participants", "fullname username avatarURL")
            .populate("lastMessage.sender", "fullname username _id")
            .sort({ "lastMessage.timestamp": -1, updatedAt: -1 });

        return res.status(200).json({
            success: true,
            conversations,
            message: "Conversation found",
        });
    } catch (error) {
        console.log("GET CONVERSATION ERROR:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// GET /api/v1/conversations/:id/messages?cursor=<messageId>&limit=30
// Paginated message history (cursor-based, newest first)

const getMessages = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const { cursor } = req.query;
        const currentUserId = req.user._id;
        const limit = parseInt(req.query.limit) || 30;

        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: currentUserId,
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        const query = { conversationId: conversationId };
        if (cursor) {
            query._id = { $lt: cursor };
        }

        const messages = await Message.find(query)
            .limit(limit + 1)
            .sort({ _id: -1 })
            .populate("sender", "fullname username avatarURL");

        const hasMore = messages.length > limit;
        if (hasMore) {
            messages.pop();
        }

        const unreadIds = messages
            .filter((message) => !message.seenBy.includes(currentUserId))
            .map((message) => message._id);

        await Promise.all([
            Message.updateMany(
                { _id: { $in: unreadIds } },
                { $addToSet: { seenBy: currentUserId } },
            ),
            Conversation.updateOne(
                { _id: conversationId },
                { $set: { [`unreadCount.${currentUserId}`]: 0 } },
            ),
        ]);

        const nextCursor = hasMore ? messages[0]._id : null;

        return res.status(200).json({
            success: true,
            messages: messages.reverse(),
            hasMore,
            nextCursor,
            message: "Messages found",
        });
    } catch (error) {
        console.log("GET CONVERSATION ERROR:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export { getOrCreateConversation, getAllConversations, getMessages };
