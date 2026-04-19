import { useEffect } from "react";
import { useConversationStore } from "../stores/conversation.store.js";
import { getSocket } from "../services/socket.services.js";

const useSocketListener = () => {
    const {
        receiveMessage,
        markRead,
        setTyping,
        setOnlineUser,
        handleConversationUpdate,
        activeConversationId,
    } = useConversationStore();

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const onNewMessage = (message) => {
            receiveMessage( message.conversationId, message);
        };

        const onMessagesRead = ({conversationId, seenBy}) => {
            markRead(conversationId, seenBy);
        };

        const onOnlineUser = (userIds) => setOnlineUser(userIds);

        const onTyping = ({conversationId, userId}) =>
            setTyping(conversationId, userId, true);

        const onConversationUpdate = ({conversationId, lastMessage}) =>
            handleConversationUpdate(conversationId, lastMessage);

        const typingStop = ({conversationId, userId}) => {
            setTyping(conversationId, userId, false);
        };


        socket.on("new_message", onNewMessage);
        socket.on("messages_read", onMessagesRead);
        socket.on("online_users", onOnlineUser);
        socket.on("typing_start", onTyping);
        socket.on("typing_stop", typingStop);
        socket.on("conversation_updated", onConversationUpdate);
        
        return ()=> {
            socket.off("new_message", onNewMessage);
            socket.off("messages_read", onMessagesRead);
            socket.off("online_users", onOnlineUser);
            socket.off("typing_start", onTyping);
            socket.off("typing_stop", typingStop);
            socket.off("conversation_updated", onConversationUpdate);
        }

    }, [
        receiveMessage,
        markRead,
        setTyping,
        setOnlineUser,
        handleConversationUpdate,
    ]);
};

export default useSocketListener;
