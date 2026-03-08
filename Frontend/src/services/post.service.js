import api from "../library/api";

export const postServices = {
    createPost: async (file, description) => {
        const formData = new FormData();
        formData.append("postImage", file);
        formData.append("description", description);
        try {
            const response = await api.post("/posts", formData);
            return response.data;
        } catch (error) {
            console.log("UPLOAD ERROR:", error.response?.data || error.message);
            throw error;
        }
    },
    loadHomeFeed: async (lastPostId, limit) => {
        try {
            const response = await api.get(`/posts/feed`, {
                params: { lastPostId, limit },
            });
            return response.data;
        } catch (error) {
            console.log(
                "LOAD HOME FEED ERROR:",
                error.response?.data || error.message,
            );
            throw error;
        }
    },
    likePost: async (postId) => {
        try {
            console.log("REACHED LIKE POST SERVICE");
            const response = await api.post(`/posts/${postId}/like`);
            return response.data;
        } catch (error) {
            console.log(
                "LIKE POST ERROR:",
                error.response?.data || error.message,
            );
            throw error;
        }
    },
    unLikePost: async (postId) => {
        try {
            console.log("REACHED UNLIKE POST SERVICE");
            const response = await api.delete(`/posts/${postId}/like`);
            return response.data;
        } catch (error) {
            console.log(
                "UNLIKE POST ERROR:",
                error.response?.data || error.message,
            );
            throw error;
        }
    },
    getPostDetails: async (postId) => {
        try {
            const res = await api.get(`/posts/${postId}`);
            return res.data;
        } catch (error) {
            console.log(
                "GET POST DETAILS ERROR:",
                error.response?.data || error.message,
            );
            throw error;
        }
    },
    addComment: async (postId, data) => {
        console.log("DATA AT THE SERVICE:", data);
        try {
            const res = await api.post(`/posts/${postId}/comments`, {
                parentCommentId:data.parentComment,
                content: data.content,
                repliedToId: data.repliedTo
            });
            return res.data;
        } catch (error) {
            console.log(
                "ADD COMMENT ERROR:",
                error.response?.data || error.message,
            );
            throw error;
        }
    },
    getAllComments: async (postId, lastCommentId, limit) => {
        try {
            const res = await api.get(`/posts/${postId}/comments`, {
                params: {
                    lastCommentId,
                    limit,
                },
            });
            return res.data;
        } catch (error) {
            console.log(
                "ADD COMMENT ERROR:",
                error.response?.data || error.message,
            );
            throw error;
        }
    },
    addCommentLike: async (postId, commentId) => {
        try {
            const res = await api.post(
                `/posts/${postId}/comments/${commentId}/like`,
            );
            return res.data;
        } catch (error) {
            console.log(
                "ADD COMMENT LIKE ERROR:",
                error.response?.data || error.message,
            );
            throw error;
        }
    },
    addCommentUnLike:  async (postId, commentId) => {
        try {
            const res = await api.delete(
                `/posts/${postId}/comments/${commentId}/like`,
            );
            return res.data;
        } catch (error) {
            console.log(
                "ADD COMMENT UNLIKE ERROR:",
                error.response?.data || error.message,
            );
            throw error;
        }
    }, 
    getAllReplies: async (commentId) => {
        try {
            const res = await api.get(`posts/comments/${commentId}/replies`);
            return res.data;
        } catch (error) {
            console.log(
                "GET ALL REPLIES ERROR:",
                error.response?.data || error.message,
            )
            throw error;
        }
    }
};