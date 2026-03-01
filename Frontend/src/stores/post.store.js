import { create } from "zustand";
import { postServices } from "../services/post.service.js";
export const usePostStore = create((set) => ({
    // posts: null,
    isLoading:false,

    uploadPost: async (file, description) => {
        try {
            set({isLoading:true})
            const res = await postServices.createPost(file, description);

            set({isLoading:false})
            return {
                post: res.post,
                success: true
            } 
        } catch (error) {
            set({isLoading:false})
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Post Upload Failed ! Try Again | Sorry for the inconvenience",
            }   
        }
    }


}))