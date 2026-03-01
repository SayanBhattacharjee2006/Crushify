import api from "../library/api";

export const postServices = {
    createPost: async (file, description) => {
        const formData = new FormData();
        formData.append("postImage", file);
        formData.append("description", description);
        try {
            const response = await api.post("/posts", formData);
            return response.data
        } catch (error) {
            console.log("UPLOAD ERROR:", error.response?.data || error.message);
            throw error;
        }
    }
}