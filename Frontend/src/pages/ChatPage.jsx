import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTypingIndicator from "../hooks/useTypingIndicator";
import { useConversationStore } from "../stores/conversation.store";
import { useAuthStore } from "../stores/auth.store";
import { getSocket } from "../services/socket.services";
import UserListCard from "../components/UserListCard.jsx";

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
        fetchMessages,
        leaveConversation,
    } = useConversationStore();

    const convoMessages = messages[conversationId] || [];
    const isTyping = (typingUsers[conversationId] || []).length > 0;

    const conversation = conversations.find(
        (convo) => convo._id === conversationId,
    );

    const otherUser = conversation?.participants.find(
        (p) => p._id !== user._id,
    );

    useEffect(() => {
        setActiveConversation(conversationId);
        fetchMessages(conversationId);
        return () => leaveConversation(conversationId);
    }, [conversationId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [convoMessages.length, isTyping]);

    const handleSendMessage = useCallback(() => {
        if (!text.trim()) return;
        getSocket()?.emit("send_message", { conversationId, text });
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

    return (
        <div>
            {/* <ChatHeader /> */}
            <div>
                <button></button>
                <div>
                    <UserListCard user={otherUser} />
                </div>
            </div>
            {/* <ChatMessages */}
            <div>
                {/* load older messages */}
                {hasMore[conversationId] && (
                    <div>
                        <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMessages}
                        >
                            {isLoadingMessages ? "Loading..." : "Load More"}
                        </button>
                    </div>
                )}
                {/* display messages */}

                {convoMessages.length === 0 && (
                    <div>No messages yet! Say Hello 😀</div>
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

                    return (
                        <div
                            key={msg._id}
                            className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                                    isOwn
                                        ? "bg-blue-500 text-white rounded-br-sm"
                                        : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
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
                        </div>
                    );
                })}
                {isTyping && (
                    <div className="flex items-start">
                        <div className="bg-white shadow-sm rounded-2xl rounded-bl-sm px-4 py-2">
                            <span className="flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                            </span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
            {/* <ChatInput */}
            <div>
                <textarea
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        onTyping();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message"
                    rows={1}
                />
                <button onClick={handleSendMessage} disabled={!text.trim()}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatPage;
