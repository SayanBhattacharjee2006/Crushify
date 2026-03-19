import React from "react";
import { useConversationStore } from "../stores/conversation.store.js";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store.js";

function ConversationsListPage() {
    const {
        fetchConversations,
        isConversationLoading,
        conversations,
        isUserOnline,
    } = useConversationStore();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    console.log("user:", user);
    const currentUserId = user._id;

    React.useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const getOtherParticipant = (conversation, userId) =>
        conversation.participants.find((participant) => participant._id !== userId);

    if (isConversationLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {conversations.length === 0 ? (
                <div> No Conversations yet 🙄</div>
            ): (
                <ul>
                    {
                        conversations.map((conversation) => {
                            const otherParticipant = getOtherParticipant(conversation, currentUserId);
                            if(!otherParticipant) return null;
                            const isOtherParticipantOnline = isUserOnline(otherParticipant._id);
                            const lastMsg = conversation.lastMessage;
                            console.log("lastMsg:", lastMsg);
                            console.log("conversation:", conversation);
                            return (
                                <li 
                                    key={conversation._id}
                                    onClick={() => navigate(`/app/messages/${conversation._id}`)}
                                >
                                    <div>
                                        {otherParticipant.username}
                                        {isOtherParticipantOnline && <span>🟢</span>}
                                    </div>
                                    <div>
                                        {lastMsg && lastMsg.content}
                                    </div>
                                </li>
                            )

                        })
                    }
                </ul>
            )}
        </div>
    );
}

export default ConversationsListPage;
