import { create } from "zustand";
import { postServices } from "../services/post.service.js";
export const usePostStore = create((set) => ({
    posts: [],
    isLoading: false,
    isFetchingMore: false, // used for cursor based pagination where we need to fetch more posts
    hasMore: true, // for cursor based pagination to know if there are more posts
    lastPostId: null, // for cursor based pagination

    uploadPost: async (file, description) => {
        try {
            set({ isLoading: true });
            const res = await postServices.createPost(file, description);

            set({ isLoading: false });
            return {
                post: res.post,
                success: true,
            };
        } catch (error) {
            set({ isLoading: false });
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Post Upload Failed ! Try Again | Sorry for the inconvenience",
            };
        }
    },

    loadHomeFeed: async () => {
        try {
            set({
                isLoading: true,
                posts: [],
                hasMore: true,
                lastPostId: null,
            });
            const res = await postServices.loadHomeFeed(null, 2);

            set({
                isLoading: false,
                posts: res.posts,
                hasMore: res.hasMore,
                lastPostId: res.lastPostId,
            });

            return {
                success: true,
            };
        } catch (error) {
            console.log(
                "LOAD HOME FEED ERROR:",
                error.response?.data || error.message,
            );
            set({ isLoading: false });
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Load Home Feed Failed ! Try Again | Sorry for the inconvenience",
            };
        }
    },
    loadMore: async () => {
        const { isFetchingMore, hasMore, lastPostId, posts } =
            usePostStore.getState();
        if (isFetchingMore || !hasMore) return;
        try {
            set({
                isFetchingMore: true,
            });

            const res = await postServices.loadHomeFeed(lastPostId, 2);

            set((state) => ({
                isFetchingMore: false,
                posts: [...state.posts, ...res.posts],
                hasMore: res.hasMore,
                lastPostId: res.lastPostId,
            }));

            return {
                success: true,
            };
        } catch (error) {
            console.log(
                "LOAD HOME FEED ERROR:",
                error.response?.data || error.message,
            );
            set({ isFetchingMore: false });
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Load Home Feed Failed ! Try Again | Sorry for the inconvenience",
            };
        }
    },

    toggleFollowStatus: (uploaderId) => {
        const { posts } = usePostStore.getState();
        const updatedPosts = posts.map((post) => {
            return post.uploader._id === uploaderId
                ? { ...post, isFollowingUploader: !post.isFollowingUploader }
                : post;
        });
        set({ posts: updatedPosts });
    },
    postLike: async (postId) => {
        try {
            console.log("REACHED POST LIKE STORE");
            const res = await postServices.likePost(postId);
            if(res.success){
                set((state) => ({
                    posts: state.posts.map(post => (
                        post._id === postId
                            ? { ...post, likeCount: post.likeCount + 1, isLikedByMe: true }
                            : post
                    ))
                }))
                return {
                    success: true,
                };
            }
        } catch (error) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Post Like Failed ! Try Again | Sorry for the inconvenience",
            };
        } 
    },

    postUnLike: async (postId) => {
        try {
            console.log("REACHED POST UNLIKE STORE");
            const res = await postServices.unLikePost(postId);
             if(res.success){
                set((state) => ({
                    posts: state.posts.map(post => (
                        post._id === postId
                            ? { ...post, likeCount: post.likeCount - 1, isLikedByMe: false }
                            : post
                    ))
                }))
                return {

                    success: true,
                };
            }
            
        } catch (error) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Post UnLike Failed ! Try Again | Sorry for the inconvenience",
            };
        } 
    },
}));
