import { Post } from "../model/post.model.js";
import { PostLike } from "../model/postLike.model.js";
import { CommentLike } from "../model/commentLike.model.js";
import {Comment} from "../model/comment.model.js";


const likePost = async (req, res) => {
    try {
        
        const userId = req.user._id;
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post || post.isDeleted) {
            return res.status(404).json({
                message: "Post does not exist",
                success: false,
            });
        }

        const isAlreadyLiked = await PostLike.exists({
            post: postId,
            likedBy: userId,
        });

        if (isAlreadyLiked) {
            return res.status(200).json({
                message: "Post already liked",
                success: true,
            });
        }

        const newLikeOnPost = await PostLike.create({
            post: postId,
            likedBy: userId,
        });

        if(newLikeOnPost){
            await post.updateOne({ $inc: { likeCount: 1 } });
        }

        console.log(`NEW LIKE REQUEST HANDLED: WITH POST ID: ${postId} and USER ID: ${userId}`);

        return res.status(201).json({
            message: "Post liked successfully",
            success: true,
        });
    } catch (error) {
        console.log("LIKE POST ERROR:", error?.message);
        return res.status(500).json({
            message: "Error at liking post",
            success: false,
        });
    }
};

const likeComment = async (req, res) => {
    try {
        const { commentId, postId } = req.params;

        const post = await Post.findById(postId);

        if (!post || post.isDeleted) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        const comment = await Comment.findById(commentId);

        if (!comment || comment.isDeleted) {
            return res.status(404).json({
                message: "Comment not found",
                success: false,
            });
        }

        if (!comment.post.equals(postId)) {
            return res.status(400).json({
                message: "Comment does not belong to this post",
                success: false,
            });
        }

        const isCommentAlreadyLiked = await CommentLike.exists({
            comment: commentId,
            likedBy: req.user._id,
        });

        if (isCommentAlreadyLiked) {
            return res.status(200).json({
                message: "Comment already liked",
                success: true,
            });
        }

        const newLikeOnComment = await CommentLike.create({
            comment: commentId,
            likedBy: req.user._id,
        });

        await comment.updateOne({ $inc: { likeCount: 1 } });

        return res.status(201).json({
            message: "Comment liked successfully",
            success: true,
            comment: comment,
        });
    } catch (error) {
        console.log("LIKE COMMENT ERROR:", error?.message);
        return res.status(500).json({
            message: "Error at liking comment",
            success: false,
        });
    }
};
const unLikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { postId } = req.params;

        

        const post = await Post.findById(postId);
        if (!post || post.isDeleted) {
            return res.status(404).json({
                message: "Post does not exist",
                success: false,
            });
        }

        const isAlreadyLiked = await PostLike.exists({
            post: postId,
            likedBy: userId,
        });

        if (!isAlreadyLiked) {
            return res.status(200).json({
                message: "Post already unliked",
                success: true,
            });
        }

        const newLikeOnPost = await PostLike.deleteOne({
            post: postId,
            likedBy: userId,
        });

        await post.updateOne({ $inc: { likeCount: -1 } });

        return res.status(201).json({
            message: "Post unliked successfully",
            success: true,
        });
    } catch (error) {
        console.log("UNLIKE POST ERROR:", error?.message);
        return res.status(500).json({
            message: "Error at unliking post",
            success: false,
        });
    }
};
const unLikeComment = async (req, res) => {
    try {
        const { commentId, postId } = req.params;

        const post = await Post.findById(postId);

        if (!post || post.isDeleted) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        const comment = await Comment.findById(commentId);

        if (!comment || comment.isDeleted) {
            return res.status(404).json({
                message: "Comment not found",
                success: false,
            });
        }

        if (!comment.post.equals(postId)) {
            return res.status(400).json({
                message: "Comment does not belong to this post",
                success: false,
            });
        }

        const isCommentAlreadyLiked = await CommentLike.exists({
            comment: commentId,
            likedBy: req.user._id,
        });

        if (!isCommentAlreadyLiked) {
            return res.status(200).json({
                message: "Comment already unliked",
                success: true,
            });
        }

        const newLikeOnComment = await CommentLike.deleteOne({
            comment: commentId,
            likedBy: req.user._id,
        })

        await comment.updateOne({ $inc: { likeCount: -1 } });

        return res.status(201).json({
            message: "Comment unliked successfully",
            success: true,
        });
    } catch (error) {
        console.log("UNLIKE COMMENT ERROR:", error?.message);
        return res.status(500).json({
            message: "Error at unliking comment",
            success: false,
        });
    }
};

export { likePost, likeComment, unLikePost, unLikeComment };
