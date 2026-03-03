import { Post } from "../model/post.model.js";
import { User } from "../model/user.model.js";
import uploadImage from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import { PostLike } from "../model/postLike.model.js";
import { Comment } from "../model/comment.model.js";
import mongoose from "mongoose";
import { CommentLike } from "../model/commentLike.model.js";
import { Follow } from "../model/follow.model.js";

const createPost = async (req, res) => {
    let cloudinaryResponse;
    try {
        const description = req.body?.description?.trim() || undefined;
        const postImageFilePath = req?.file?.path;

        if (postImageFilePath && !req.file.mimetype.startsWith("image/")) {
            console.log("Image file type is only supported");
            return res.status(400).json({
                message: "Image file type is only supported",
                success: false,
            });
        }

        if (!description && !postImageFilePath) {
            return res.status(400).json({
                message: "either of description or post image is required",
                success: false,
            });
        }

        const id = req.user._id;

        if (postImageFilePath) {
            cloudinaryResponse = await uploadImage(postImageFilePath);
            if (!cloudinaryResponse) {
                return res.status(500).json({
                    message: "Error at uploading post image",
                    success: false,
                });
            }
        }

        const newPost = await Post.create({
            description,
            uploader: id,
            imageURL: cloudinaryResponse?.secure_url,
            imagePublicId: cloudinaryResponse?.public_id,
            likeCount: 0,
            commentsCount: 0,
            isDeleted: false,
        });

        return res.status(201).json({
            message: "Post created successfully",
            post: newPost,
            success: true,
        });
    } catch (error) {
        console.log("Error at creating post:", error?.message);
        if (cloudinaryResponse?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResponse?.public_id);
        }
        return res.status(500).json({
            message: "Error at creating post",
            error: error?.message,
            success: false,
        });
    }
};
const deletePost = async (req, res) => {
    try {
        const id = req.user._id;
        const { postId } = req.params;
        console.log("postId:", postId);
        const post = await Post.findById(postId);

        if (!post) {
            console.log("post res:", post);
            return res.status(404).json({
                message: "post not found",
                success: false,
            });
        }

        if (!post.uploader.equals(id)) {
            return res.status(403).json({
                message: "You are not authorized to delete this post",
                success: false,
            });
        }

        if (post.isDeleted) {
            return res.status(200).json({
                message: "Post already deleted",
                success: true,
            });
        }

        post.isDeleted = true;
        post.imageURL = undefined;
        post.imagePublicId = undefined;
        await post.save();

        try {
            if (post.imagePublicId) {
                await cloudinary.uploader.destroy(post.imagePublicId);
            }
        } catch (error) {
            console.log("Error at deleting post image:", error?.message);
        }

        return res.status(200).json({
            message: "Post deleted successfully",
            success: true,
        });
    } catch (error) {
        console.log("Error at deleting post:", error?.message);
        return res.status(500).json({
            message: "Error at deleting post",
            error: error?.message,
            success: false,
        });
    }
};

const getPostDetails = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate("uploader");

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        if (post.isDeleted) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        const isLikedByUser = await PostLike.exists({
            post: postId,
            user: req.user._id,
        });

        return res.status(200).json({
            message: "Post found",
            data: {
                imageURL: post.imageURL,
                description: post.description,
                uploaderFullName: post.uploader.fullname,
                uploaderUsername: post.uploader.username,
                uploaderId: post.uploader._id,
                uploaderProfileImage: post.uploader.profileImage,
                likeCount: post.likeCount,
                commentsCount: post.commentsCount,
                isLiked: isLikedByUser ? true : false,
            },
            success: true,
            postedAt: post.createdAt,
        });
    } catch (error) {
        console.log("Error at getting post details:", error?.message);
        return res.status(500).json({
            message: "Error at getting post details",
            error: error?.message,
            success: false,
        });
    }
};

const getFeed = async (req, res) => {
    try {
        const { lastPostId } = req.query;
        const limit = parseInt(req.query.limit) || 15;
        const userObjectId = new mongoose.Types.ObjectId(req.user._id);

        let matchCondition = {
            isDeleted: false,
        };

        if (lastPostId && !mongoose.Types.ObjectId.isValid(lastPostId)) {
            return res.status(400).json({
                message: "Invalid last post id",
                success: false,
            });
        }

        if (lastPostId) {
            matchCondition._id = {
                $lt: new mongoose.Types.ObjectId(lastPostId),
            };
        }

        const posts = await Post.aggregate([
            {
                $match: matchCondition,
            },
            {
                $sort: {
                    _id: -1,
                },
            },
            {
                $limit: limit,
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$uploader" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$userId"],
                                },
                            },
                        },
                        {
                            $project: {
                                fullname: 1,
                                username: 1,
                                avatarURL: 1,
                            },
                        },
                    ],
                    as: "uploader",
                },
            },
            {
                $unwind: "$uploader",
            },
            {
                $lookup: {
                    from: "postlikes",
                    let: { postId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$post", "$$postId"],
                                        },
                                        {
                                            $eq: ["$likedBy", userObjectId],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "postLikedByUserDoc",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: { uploaderId: "$uploader._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$follower", userObjectId],
                                        },
                                        {
                                            $eq: ["$following", "$$uploaderId"],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "uploaderFollowedByUserDoc",
                },
            },
            {
                $addFields: {
                    isLikedByMe: {
                        $gt: [
                            {
                                $size: "$postLikedByUserDoc",
                            },
                            0,
                        ],
                    },
                    isFollowingUploader: {
                        $gt: [
                            {
                                $size: "$uploaderFollowedByUserDoc",
                            },
                            0,
                        ],
                    },
                },
            },
            {
                $project: {
                    uploader: 1,
                    description: 1,
                    imageURL: 1,
                    likeCount: 1,
                    commentsCount: 1,
                    createdAt: 1,
                    isLikedByMe: 1,
                    isFollowingUploader: 1,
                },
            },
        ]);

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts,
            hasMore: posts.length === limit ? true : false,
            lastPostId: posts[posts.length - 1]?._id,
            success: true,
        });
    } catch (error) {
        console.log("Error at getting feed:", error?.message);
        return res.status(500).json({
            message: "Error at getting feed",
            error: error?.message,
            success: false,
        });
    }
};

const getAllComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                message: "Invalid post id",
                success: false,
            });
        }

        const objectPostId = new mongoose.Types.ObjectId(postId);
        const currentUserObjectId = new mongoose.Types.ObjectId(userId);

        const allComments = await Comment.aggregate([
            {
                $match: {
                    post: objectPostId,
                    isDeleted: false,
                    parentComment: null,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$commentedBy" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$userId"],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                fullname: 1,
                                username: 1,
                                avatarURL: 1,
                            },
                        },
                    ],
                    as: "commentedBy",
                },
            },
            {
                $unwind: "$commentedBy",
            },
            {
                $lookup: {
                    from: "commentlikes",
                    let: { commentId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                "$likedBy",
                                                currentUserObjectId,
                                            ],
                                        },
                                        {
                                            $eq: ["$comment", "$$commentId"],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "isLikedByUser",
                },
            },
            {
                $addFields: {
                    isLikedByMe: {
                        $gt: [{ $size: "$isLikedByUser" }, 0],
                    },
                },
            },
            {
                $project: {
                    commentedBy: 1,
                    content: 1,
                    post: 1,
                    parentComment: 1,
                    likeCount: 1,
                    repliesCount: 1,
                    createdAt: 1,
                    isLikedByMe: 1,
                },
            },
        ]);

        return res.status(200).json({
            message: "all comments fetched successfully",
            comments: allComments,
            pagination: {
                page,
                limit,
                hasMore: allComments.length === limit,
            },
            success: true,
        });
    } catch (error) {
        console.log("Error while fetching post comments", error?.message);
        return res.status(500).json({
            message: "Error while fetching post comments ",
            success: false,
            error: error?.message,
        });
    }
};

const getAllReplies = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                message: "Invalid post id",
                success: false,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                message: "Invalid comment id",
                success: false,
            });
        }

        const objectPostId = new mongoose.Types.ObjectId(postId);
        const objectCommentId = new mongoose.Types.ObjectId(commentId);
        const ObjectuserId = new mongoose.Types.ObjectId(req.user._id);

        const replies = await Comment.aggregate([
            {
                $match: {
                    post: objectPostId,
                    parentComment: objectCommentId,
                    isDeleted: false,
                },
            },
            {
                $sort: {
                    createdAt: 1,
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$commentedBy" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$userId"],
                                },
                            },
                        },
                        {
                            $project: {
                                fullname: 1,
                                username: 1,
                                avatarURL: 1,
                            },
                        },
                    ],
                    as: "commentedBy",
                },
            },
            {
                $unwind:"$commentedBy"
            },
            {
                $lookup:{
                    from:"commentlikes",
                    let:{commentId:"$_id"},
                    pipeline:[
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                "$likedBy",
                                                ObjectuserId,
                                            ],
                                        },
                                        {
                                            $eq: ["$comment", "$$commentId"],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as:"isLikedByUser"
                }
            },
            {
                $addFields: {
                    isLikedByMe: {
                        $gt: [{ $size: "$isLikedByUser" }, 0],
                    },
                },
            },
            {
                $project: {
                    commentedBy: 1,
                    content: 1,
                    parentComment: 1,
                    likeCount: 1,
                    repliesCount: 1,
                    createdAt: 1,
                    isLikedByMe: 1,
                    isLikedByUser:0
                },
            }
        ]);

        return res.status(200).json({
            message: "all replies fetched successfully",
            replies: replies,
            success: true,
        });

    } catch (error) {
        console.log("Error while fetching post replies", error?.message);
        return res.status(500).json({
            message: "Error while fetching post replies ",
            success: false,
            error: error?.message,
        });
    }
};

export {
    createPost,
    deletePost,
    getPostDetails,
    getFeed,
    getAllComments,
    getAllReplies,
};
