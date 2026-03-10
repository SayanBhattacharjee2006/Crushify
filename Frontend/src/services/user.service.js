import api from "../library/api";

export const userServices = {
    uploadProfilePicture: async (file) => {
        const formData = new FormData();
        formData.append("avatar", file);
        try {
            const response = await api.post("/users/avatar", formData);
            console.log("UPLOAD RESPONSE:", response.data);
            return response.data;
        } catch (error) {
            console.log("UPLOAD ERROR:", error.response?.data || error.message);
            throw error;
        }
    },
    completeProfile: async(data) => {
        // console.log("REACHED SERVICE");
        const response = await api.post("/users/complete-profile", data);
        // console.log("SERVICE RESPONSE:", response.data);
        return response.data
    },
    getfollowStatus: async(id) =>{
        const response = await api.get(`/users/${id}/follow/status`);
        return response.data
    },
    updateProfile: async(data) => {
        const response = await api.patch("/users/complete-profile", data);
        return response.data
    },
    deleteAvatar: async() => {
        const response = await api.delete("/users/avatar");
        return response.data;
    },
    followUser: async (id) => {
        const response = await api.post(`/users/${id}/follow`,);
        return response.data
    },
    unfollowUser: async (id) => {
        const response = await api.delete(`/users/${id}/follow`);
        return response.data
    },
    getAllFollowers: async (id) => {
        const response = await api.get(`/users/${id}/followers`);
        return response.data
    },
    getAllFollowing: async (id) => {
        const response = await api.get(`/users/${id}/following`);
        return response.data
    },
    getUserDetails: async(id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    }
};
