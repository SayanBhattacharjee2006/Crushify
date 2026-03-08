import { Comment } from "../model/comment.model.js";
import { Post } from "../model/post.model.js";
import { User } from "../model/user.model.js";
import {CommentLike} from "../model/commentLike.model.js"

const createComment = async (req, res) => {
    try {
        const content = req.body.content?.trim();
        let parentCommentId = req.body.parentCommentId;
        const repliedToId = req.body.repliedToId || null;
        const { postId } = req.params;

        console.log("PARENTCOMMENT",parentCommentId);
        console.log("REPLIEDTOID:",repliedToId);
        if (!content) {
            return res.status(400).json({
                message: "Missing required fields",
                success: false,
            });
        }

        if (repliedToId && !parentCommentId) {
            return res.status(400).json({
                message: "cannot reply to a user without a parent comment",
                success: false,
            });
        }

        const isPostExist = await Post.exists({ _id: postId });

        if (!isPostExist) {
            return res.status(404).json({
                message: "Post does not exist",
                success: false,
            });
        }

        let newComment;

        if (parentCommentId) {
            const parentCommentDoc = await Comment.findById(parentCommentId);
            if (!parentCommentDoc) {
                return res.status(404).json({
                    message: "Parent comment does not exist",
                    success: false,
                });
            }

            if (!parentCommentDoc.post.equals(postId)) {
                return res.status(400).json({
                    message: "Parent comment does not belong to this post",
                    success: false,
                });
            }
            let rootComment = parentCommentDoc;
            if (parentCommentDoc.parentComment) {
                rootComment = await Comment.findById(
                    parentCommentDoc.parentComment,
                );
                parentCommentId = rootComment._id;
            }

            // create comment with parentCommentID
            newComment = await Comment.create({
                commentedBy: req.user._id,
                content,
                post: postId,
                parentComment: parentCommentId,
                likeCount: 0,
                repliesCount: 0,
                isDeleted: false,
                repliedTo: repliedToId,
            });
            await Comment.findByIdAndUpdate(rootComment._id, {
                $inc: { repliesCount: 1 },
            });
        } else {
            newComment = await Comment.create({
                commentedBy: req.user._id,
                content,
                post: postId,
                parentComment: null,
                likeCount: 0,
                repliesCount: 0,
                isDeleted: false,
                repliedTo: repliedToId,
            });
            await Post.findByIdAndUpdate(postId, {
                $inc: { commentsCount: 1 },
            });
        }

        const uploaderDetails = await User.findById(req.user._id).select(
            "fullname username avatarURL",
        );

        const isCommentLikedByMe = await CommentLike.exists({
            comment: newComment._id,
            user: req.user._id,
        });

        return res.status(201).json({
            message: "Comment created successfully",
            success: true,
            comment: {
                _id: newComment._id,
                commentedBy: {
                    _id: req.user._id,
                    fullname: uploaderDetails.fullname,
                    username: uploaderDetails.username,
                    avatarURL: uploaderDetails.avatarURL,
                },
                content: content,
                post: postId,
                parentComment: parentCommentId,
                likeCount: newComment.likeCount,
                repliesCount: newComment.repliesCount,
                createdAt: newComment.createdAt,
                isLikedByMe: isCommentLikedByMe,
            },
        });
    } catch (error) {
        console.log("CREATE COMMENT ERROR:", error?.message);
        return res.status(500).json({
            message: "Internal server error",
            error: error?.message,
            success: false,
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId, postId } = req.params;

        // check post exist or not
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
                success: false,
            });
        }

        if (comment.post.toString() !== postId) {
            return res.status(400).json({
                message: "Comment does not belong to this post",
                success: false,
            });
        }

        if (comment.isDeleted) {
            return res.status(400).json({
                message: "Comment already deleted",
                success: false,
            });
        }

        if (!comment.commentedBy.equals(req.user._id)) {
            return res.status(403).json({
                message: "You are not authorized to delete this comment",
                success: false,
            });
        }

        if (comment.parentComment) {
            const parentComment = await Comment.findById(comment.parentComment);
            if (!parentComment) {
                return res.status(404).json({
                    message: "Parent comment not found",
                    success: false,
                });
            }

            // parentComment.repliesCount -= 1;
            // await parentComment.save();
            await Comment.findByIdAndUpdate(parentComment._id, {
                $inc: { repliesCount: -1 },
            });
        } else {
            // post.commentsCount -= 1;
            // await post.save();
            await Post.findByIdAndUpdate(postId, {
                $inc: { commentsCount: -1 },
            });
        }

        await Comment.findByIdAndUpdate(commentId, { isDeleted: true });

        return res.status(200).json({
            message: "Comment deleted successfully",
            success: true,
        });
    } catch (error) {
        console.log("DELETE COMMENT ERROR:", error?.message);
        return res.status(500).json({
            message: "Internal server error",
            error: error?.message,
            success: false,
        });
    }
};

export { createComment, deleteComment };
