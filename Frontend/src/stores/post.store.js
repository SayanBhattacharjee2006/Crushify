import { create } from "zustand";
import { postServices } from "../services/post.service.js";

const updateReplyList = (state, parentCommentId, updater) => ({
    repliesByCommentId: {
        ...state.repliesByCommentId,
        [parentCommentId]: updater(
            state.repliesByCommentId[parentCommentId] || [],
        ),
    },
});

export const usePostStore = create((set) => ({
    posts: [],
    isLoading: false,
    isFetchingMore: false,
    hasMore: true, 
    lastPostId: null,
    repliesByCommentId:{},
    isReplyAlreadyFetched:{},
    isFetchingReplies:{},

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
            if (res.success) {
                set((state) => ({
                    posts: state.posts.map((post) =>
                        post._id === postId
                            ? {
                                  ...post,
                                  likeCount: post.likeCount + 1,
                                  isLikedByMe: true,
                              }
                            : post,
                    ),
                }));
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
            if (res.success) {
                set((state) => ({
                    posts: state.posts.map((post) =>
                        post._id === postId
                            ? {
                                  ...post,
                                  likeCount: post.likeCount - 1,
                                  isLikedByMe: false,
                              }
                            : post,
                    ),
                }));
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
    getPostDetails: async (postId) => {
        try {
            set({ isLoading: true });
            const res = await postServices.getPostDetails(postId);
            return res;
        } catch (error) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Get Post Details Failed ! Try Again | Sorry for the inconvenience",
            };
        } finally {
            set({ isLoading: false });
        }
    },
    addComment: async (postId, data) => {
        try {
            const response = await postServices.addComment(postId, data);
            if (response.comment.parentComment) {
                const parentCommentId = response.comment.parentComment;
                set((state) => ({
                    repliesByCommentId: {
                        ...state.repliesByCommentId,
                        [parentCommentId]: [
                            ...(state.repliesByCommentId[parentCommentId] || []),
                            response.comment,
                        ],
                    },
                    isReplyAlreadyFetched: {
                        ...state.isReplyAlreadyFetched,
                        [parentCommentId]: true,
                    },
                }));
            }

            return response;
        } catch (error) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Add Comment Failed ! Try Again | Sorry for the inconvenience",
            };
        }
    },
    getAllComments: async (postId, lastCommentId) => {
        try {
            const response = await postServices.getAllComments(
                postId,
                lastCommentId,
                2,
            );
            return response;
        } catch (error) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Get All Comments Failed ! Try Again | Sorry for the inconvenience",
            };
        }
    },
    likeComment: async (postId, commentId, parentCommentId = null) => {
        try {
            const res = await postServices.addCommentLike(postId, commentId);
            if (res.success && parentCommentId) {
                set((state) =>
                    updateReplyList(state, parentCommentId, (replies) =>
                        replies.map((reply) =>
                            reply._id === commentId
                                ? {
                                      ...reply,
                                      likeCount: reply.likeCount + 1,
                                      isLikedByMe: true,
                                  }
                                : reply,
                        ),
                    ),
                );
            }

            return res;
        } catch (error) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Like Comment Failed ! Try Again | Sorry for the inconvenience",
            };
        }
    },
    unLikeComment: async (postId, commentId, parentCommentId = null) => {
        try {
            const res = await postServices.addCommentUnLike(postId, commentId);
            if (res.success && parentCommentId) {
                set((state) =>
                    updateReplyList(state, parentCommentId, (replies) =>
                        replies.map((reply) =>
                            reply._id === commentId
                                ? {
                                      ...reply,
                                      likeCount: Math.max(
                                          0,
                                          reply.likeCount - 1,
                                      ),
                                      isLikedByMe: false,
                                  }
                                : reply,
                        ),
                    ),
                );
            }
            return res;
        } catch (error) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "UnLike Comment Failed ! Try Again | Sorry for the inconvenience",
            };
        }
    },
    getAllReplies: async (commentId) => {
        const { isReplyAlreadyFetched } = usePostStore.getState();  
        if(isReplyAlreadyFetched[commentId])return; 
        try {
            set(state=>({
                ...state,
                isFetchingReplies:{
                    ...state.isFetchingReplies,
                    [commentId]:true
                }
            })
            )
            const res = await postServices.getAllReplies(commentId);
            set(state=>({
                ...state,
                isReplyAlreadyFetched: {
                    ...state.isReplyAlreadyFetched,
                    [commentId]: true
                },
                repliesByCommentId:{
                    ...state.repliesByCommentId,
                    [commentId]:res.replies
                },
                isFetchingReplies:{
                    ...state.isFetchingReplies,
                    [commentId]:false
                }
            }))
            return res;
        } catch (error) {
            set(state=>({
                ...state,
                isFetchingReplies:{
                    ...state.isFetchingReplies,
                    [commentId]:false,
                }
            })
            )
            return{
                success: false,
                error:
                    error.response?.data?.message ||
                    "Get All Replies Failed ! Try Again | Sorry for the inconvenience",
            }
        }
    }
}));
