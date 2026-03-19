import api from "../library/api.js";

export const conversationServices = {
    getOrCreateConversation: async (id) => {
        const response = await api.post(`/conversations/${id}`);
        return response.data
    },
    getAllConversations: async () => {
        const response = await api.get("/conversations");
        return response.data
    },
    getAllMessages: async (id,limit,cursor) => {
        const response = await api.get(`/conversations/${id}`, {
            params:{limit, cursor}
        })
        return response.data
    }
}