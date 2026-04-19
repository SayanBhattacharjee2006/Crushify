import { conversationServices } from "../services/conversation.service.js";
import { create } from "zustand";
import { getSocket } from "../services/socket.services.js";

export const useConversationStore = create((set, get) => ({
    conversations: [], // [{conversationsId,all metadata}]
    hasMore: {}, // {[conversationRoomId] : boolean}
    isConversationLoading: false, // boolean
    messages: {}, // {[conversationRoomId] : Array<messages>}
    activeConversationId: null, // conversationRoomId
    nextCursor: {}, // {[conversationRoomId] : messageId}
    isLoadingMessages: false, // {boolean}
    typingUsers: {}, // {[conversationRoomId] : Array<userId>}
    onlineUsers: [], // Array<userId>

    // conversations related store functions---------------
    fetchConversations: async () => {
        try {
            set({ isConversationLoading: true });
            const res = await conversationServices.getAllConversations();
            set({
                conversations: res.conversations,
            });
            return {
                success: true,
            };
        } catch (error) {
            console.log(
                "FETCH CONVERSATIONS ERROR:",
                error.response?.data || error.message,
            );
            return {
                success: false,
            };
        } finally {
            set({ isConversationLoading: false });
        }
    },

    openConversation: async (userId) => {
        try {
            const res =
                await conversationServices.getOrCreateConversation(userId);
            const convoId = res.conversation._id;
            set((state) => {
                const exist = state.conversations.some((id) => id === convoId);

                return {
                    activeConversationId: convoId,
                    conversations: exist
                        ? state.conversations
                        : [...state.conversations, res.conversation],
                };
            });

            getSocket()?.emit("join_conversation", convoId);
            return convoId;
        } catch (error) {
            console.error("OPEN CONVERSATION ERROR:", error);
        }
    },

    setActiveConversation: async (convoId) => {
        set({
            activeConversationId: convoId,
        });

        if (convoId) {
            getSocket()?.emit("join_conversation", convoId);
        }
    },

    leaveConversation: async (convoId) => {
        getSocket()?.emit("leave_conversation", convoId);
        set({
            activeConversationId: null,
        });
    },

    // message / chatting related store functions ---------------

    fetchMessages: async (convoId, loadMore = false) => {
        set({ isLoadingMessages: true });
        try {
            const cursor = loadMore ? get().nextCursor[convoId] : null;
            const limit = loadMore ? 10 : 30;
            console.log("Fetching messages for", convoId);
            const res = await conversationServices.getAllMessages(
                convoId,
                limit,
                cursor,
            );
            console.log("FETCHED MESSAGES", res);
            set((state) => ({
                messages: {
                    [convoId]: loadMore
                    ? [...state.messages[convoId], ...res.messages]
                    : res.messages,
                },
                hasMore: { ...state.hasMore, [convoId]: res.hasMore },
                nextCursor: { ...state.nextCursor, [convoId]: res.nextCursor },
            }));
            console.log("Messages in store: ", get().messages);
        } catch (error) {
            console.error("FETCH MESSAGES ERROR:", error);
        } finally {
            set({ isLoadingMessages: false });
        }
    },

    receiveMessage: async (convoId, content) => {
        set((state) => {
            const existing = state.messages[convoId] || [];
            if (existing.some((message) => message._id == content._id))
                return {};

            //update message list
            const updatedMessages = {
                ...state.messages,
                [convoId]: [...existing, content],
            };

            //updated conversation list (update the last message)
            const updatedConversations = state.conversations.map((convo) =>
                convo._id == convoId
                    ? {
                          ...convo,
                          lastMessage: {
                              content: content.content,
                              sender: content.sender,
                              timestamp: content.timestamp,
                          },
                      }
                    : convo,
            );

            const idx = updatedConversations.findIndex(
                (convo) => convo._id === convoId,
            );
            if (idx > 0) {
                const [moved] = updatedConversations.splice(idx, 1);
                updatedConversations.unshift(moved);
            }

            return {
                conversations: updatedConversations,
                messages: updatedMessages,
            };
        });
    },

    markRead: async (conversationId, seenByUserId) => {
        set((state) => ({
            messages: {
                ...state.messages,
                [conversationId]: (state.messages[conversationId] || []).map(
                    (message) =>
                        message.seenBy?.includes(seenByUserId)
                            ? message
                            : {
                                  ...message,
                                  seenBy: [
                                      ...(message.seenBy || []),
                                      seenByUserId,
                                  ],
                              },
                ),
            },
        }));
    },

    setTyping: async (conversationId, userId, isTyping) => {
        set((state) => {
            const current = state.typingUsers[conversationId] || [];
            const updated = isTyping
                ? current.includes(userId)
                    ? current
                    : [...current, userId]
                : current.filter((id) => id !== userId);
                return {
                    typingUsers: {
                        ...state.typingUsers,
                        [conversationId]: updated,
                    },
                };
            });
    },

    isUserOnline:  (userId) => get().onlineUsers.includes(userId),

    setOnlineUser: async (userIds) => set({ onlineUsers: userIds }),

    //conversation updates when the user in the personal room but not is the conversation room
    handleConversationUpdate: async (conversationId, lastMessage) => {
        set((state) => {
            const updated = state.conversations.map((convo) =>
                convo._id === conversationId
                    ? {
                          ...convo,
                          lastMessage,
                      }
                    : convo,
            );

            const idx = updated.findIndex((convo) => convo._id === conversationId);

            if(idx > 0){
                const [moved] = updated.splice(idx,1);
                updated.unshift(moved);
            }
            return {
                conversations: updated
            }
        });
    },
}));
