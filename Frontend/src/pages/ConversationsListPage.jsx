import React from "react";
import { useConversationStore } from "../stores/conversation.store.js";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store.js";
import { motion, AnimatePresence } from "motion/react";

function ConversationsListPage() {
    const {
        fetchConversations,
        isConversationLoading,
        conversations,
        isUserOnline,
    } = useConversationStore();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    // console.log("user:", user);
    const currentUserId = user._id;

    React.useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const getOtherParticipant = (conversation, userId) =>
        conversation.participants.find((participant) => participant._id.toString() !== userId.toString());

    if (isConversationLoading) {
        return (
            <div className="max-w-xl mx-auto py-4 px-2">
                <div className="h-8 w-36 bg-zinc-200 dark:bg-gray-700 rounded-lg animate-pulse mb-5" />
                <ul className="flex flex-col gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <li key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                            <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-gray-700 animate-pulse" />
                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                                <div className="h-4 w-28 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-3 w-44 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" />
                            </div>
                            <div className="h-3 w-10 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-4 px-2">
            <h1 className="text-2xl font-bold dark:text-white mb-5">Messages</h1>
            {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400 text-sm">
                    No Conversations yet 🙄
                </div>
            ): (
                <ul className="flex flex-col gap-3">
                    <AnimatePresence>
                    {
                        conversations.map((conversation) => {
                            const otherParticipant = getOtherParticipant(conversation, currentUserId);
                            if(!otherParticipant) return null;
                            const isOtherParticipantOnline = isUserOnline(otherParticipant._id);
                            const lastMsg = conversation.lastMessage;
                            // console.log("lastMsg:", lastMsg);
                            // console.log("conversation:", conversation);
                            return (
                                <motion.li
                                    key={conversation._id}
                                    onClick={() => navigate(`/app/messages/${conversation._id}`)}
                                    className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-800 cursor-pointer hover:bg-zinc-100 dark:hover:bg-gray-700 transition-colors"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={otherParticipant.avatarURL}
                                            alt={otherParticipant.username}
                                            className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-600"
                                        />
                                        {isOtherParticipantOnline && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                                        )}
                                    </div>
                                    {/* Name & last message */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-lg font-semibold dark:text-white truncate">
                                            {otherParticipant.username}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {lastMsg && lastMsg.content}
                                        </div>
                                    </div>
                                    {/* Timestamp */}
                                    {lastMsg && lastMsg.createdAt && (
                                        <span className="text-xs text-gray-400 flex-shrink-0">
                                            {new Date(lastMsg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    )}
                                </motion.li>
                            )

                        })
                    }
                    </AnimatePresence>
                </ul>
            )}
        </div>
    );
}

export default ConversationsListPage;
