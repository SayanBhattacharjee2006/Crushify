import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTypingIndicator from "../hooks/useTypingIndicator";
import { useConversationStore } from "../stores/conversation.store";
import { useAuthStore } from "../stores/auth.store";
import { getSocket } from "../services/socket.services";
import UserListCard from "../components/UserListCard.jsx";
import { motion, AnimatePresence } from "motion/react";
import { IoArrowBack, IoSend } from "react-icons/io5";

function ChatPage() {

    const { id: conversationId } = useParams();
    const navigate = useNavigate();
    const bottomRef = useRef(null);
    const [text, setText] = useState("");
    const { user } = useAuthStore();
    const { onTyping } = useTypingIndicator(conversationId);

    const {
        conversations,
        hasMore,
        messages,
        setActiveConversation,
        isLoadingMessages,
        typingUsers,
        onlineUsers,
        fetchConversations,
        fetchMessages,
        leaveConversation,
    } = useConversationStore();

    const convoMessages = messages[conversationId] || [];
    const isTyping = (typingUsers[conversationId] || []).length > 0;

    const conversation = conversations.find(
        (convo) => convo._id === conversationId,
    );

    const otherUser = conversation?.participants.find(
        (p) => p._id.toString() !== user._id.toString(),
    );

    useEffect(() => {
        if(conversations.length === 0){
            fetchConversations();
        }
        setActiveConversation(conversationId);
        fetchMessages(conversationId);
        return () => leaveConversation(conversationId);
    }, [conversationId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [convoMessages.length, isTyping]);

    const handleSendMessage = useCallback(() => {
        if (!text.trim()) return;
        getSocket()?.emit("send_message", { conversationId, content: text });
        setText("");
    }, [text, conversationId]);

    const handleKeyDown = (e) => {
        if (e.key == "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleLoadMore = () => {
        fetchMessages(conversationId, true);
    };

    if(!conversation || !otherUser) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isOtherOnline = onlineUsers?.includes(otherUser._id);

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] max-w-2xl mx-auto bg-white dark:bg-gray-900">
            {/* <ChatHeader /> */}
            <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600">
                <button
                    onClick={() => navigate("/app/messages")}
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-gray-700 transition-colors dark:text-white"
                >
                    <IoArrowBack className="w-5 h-5" />
                </button>
                <div className="relative flex-shrink-0">
                    <img
                        src={otherUser.avatarURL}
                        alt={otherUser.username}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-600"
                    />
                    {isOtherOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-lg font-semibold dark:text-white truncate">{otherUser.username}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {isOtherOnline ? "Online" : "Offline"}
                    </span>
                </div>
            </div>
            {/* <ChatMessages */}
            <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-gray-900 px-4 py-4 flex flex-col gap-1">
                {/* load older messages */}
                {hasMore[conversationId] && (
                    <div className="flex justify-center mb-3">
                        <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMessages}
                            className="text-xs text-indigo-500 bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-zinc-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
                        >
                            {isLoadingMessages ? "Loading..." : "Load More"}
                        </button>
                    </div>
                )}
                {/* display messages */}

                {convoMessages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20">
                        <img
                            src={otherUser.avatarURL}
                            alt={otherUser.username}
                            className="w-16 h-16 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-600"
                        />
                        <span className="text-lg font-semibold dark:text-white">{otherUser.username}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Say hello! 👋</span>
                    </div>
                )}

                {convoMessages.map((msg, idx) => {
                    const isOwn = msg.sender._id === user._id;
                    // isLastOwn is used to decide after which message to show the seen icon or not
                    const isLastOwn =
                        isOwn &&
                        (idx === convoMessages.length - 1 ||
                            convoMessages[idx + 1]?.sender._id !== user._id);

                    const seenByOther =
                        isOwn &&
                        isLastOwn &&
                        msg.seenBy?.some((id) => id != user._id);

                    const isFirstInGroup =
                        idx === 0 || convoMessages[idx - 1]?.sender._id !== msg.sender._id;

                    return (
                        <motion.div
                            key={msg._id}
                            className={`flex flex-col ${isOwn ? "items-end" : "items-start"} ${isFirstInGroup ? "mt-3" : "mt-0.5"}`}
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                                    isOwn
                                        ? "bg-indigo-600 text-white rounded-br-sm"
                                        : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-600 shadow-sm rounded-bl-sm"
                                }`}
                            >
                                {msg.content}
                            </div>
                            {/* Read receipt — only show on last sent message */}
                            {seenByOther && (
                                <span className="text-xs text-gray-400 mt-0.5 mr-1">
                                    Seen
                                </span>
                            )}
                        </motion.div>
                    );
                })}
                <AnimatePresence>
                {isTyping && (
                    <motion.div
                        className="flex items-start mt-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                    >
                        <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-sm rounded-2xl rounded-bl-sm px-4 py-2">
                            <span className="flex gap-1 items-center h-5">
                                {[0, 1, 2].map((i) => (
                                    <motion.span
                                        key={i}
                                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{
                                            duration: 0.6,
                                            repeat: Infinity,
                                            delay: i * 0.15,
                                        }}
                                    />
                                ))}
                            </span>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>
            {/* <ChatInput */}
            <div className="sticky bottom-0 flex items-end gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-600">
                <textarea
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        onTyping();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message"
                    rows={1}
                    className="flex-1 bg-zinc-100 dark:bg-gray-800 rounded-2xl px-4 py-2.5 text-sm dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none max-h-[120px] overflow-y-auto"
                    style={{ fieldSizing: 'content' }}
                />
                <motion.button
                    onClick={handleSendMessage}
                    disabled={!text.trim()}
                    className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-colors hover:bg-indigo-700"
                    whileTap={{ scale: 0.9 }}
                >
                    <IoSend className="w-5 h-5" />
                </motion.button>
            </div>
        </div>
    );
}

export default ChatPage;
