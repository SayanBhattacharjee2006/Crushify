import {Post} from "../model/post.model.js";
import { User } from "../model/user.model.js";
import uploadImage from "../utils/cloudinary.js";
import {v2 as cloudinary} from  "cloudinary"
import { PostLike } from "../model/postLike.model.js";
import { Comment } from "../model/comment.model.js";

const createPost = async (req, res) => {
    let cloudinaryResponse;
    try {
        const description = req.body?.description?.trim() || undefined;
        const postImageFilePath = req?.file?.path;
        
        if(postImageFilePath && !req.file.mimetype.startsWith("image/")){
            console.log("Image file type is only supported");
            return res
                    .status(400)
                    .json({
                        message:"Image file type is only supported",
                        success:false
                    })
        }

        if(!description && !postImageFilePath){
            return res
                    .status(400)
                    .json({
                        message:"either of description or post image is required",
                        success:false,
                    })
        }

        

        
        const id = req.user._id;


        if(postImageFilePath){
            cloudinaryResponse = await uploadImage(postImageFilePath);
            if(!cloudinaryResponse){
                return res
                        .status(500)
                        .json({
                            message:"Error at uploading post image",
                            success:false,
                        })
            }
        }
        
        
        const newPost = await Post.create({
            description,
            uploader:id,
            imageURL:cloudinaryResponse?.secure_url,
            imagePublicId:cloudinaryResponse?.public_id,
            likeCount:0,
            commentsCount:0,
            isDeleted:false
        })

        
        return res
                .status(201)
                .json({
                    message:"Post created successfully",
                    post:newPost,
                    success:true,
                })

    } catch (error) {
        console.log("Error at creating post:",error?.message);
        if(cloudinaryResponse?.public_id){
            await cloudinary.uploader.destroy(cloudinaryResponse?.public_id);
        }
        return res  
            .status(500)
            .json({
                message:"Error at creating post",
                error:error?.message,
                success:false
            }) 
    }
}
const deletePost = async (req,res) => {
    try {
        const id = req.user._id;
        const {postId} = req.params;
        console.log("postId:", postId)
        const post = await Post.findById(postId);

        if(!post){
            console.log("post res:", post)
            return res
                    .status(404)
                    .json({
                        message:"post not found",
                        success:false,
                    })
        }

        if(!post.uploader.equals(id)){
            return res
                    .status(403)
                    .json({
                        message:"You are not authorized to delete this post",
                        success:false,
                    })
        }

        if(post.isDeleted){
            return res
                    .status(200)
                    .json({
                        message:"Post already deleted",
                        success:true
                    })
        }

        post.isDeleted = true;
        post.imageURL = undefined;
        post.imagePublicId = undefined;
        await post.save();

        try {
            if(post.imagePublicId){
                await cloudinary.uploader.destroy(post.imagePublicId);
            }
        } catch (error) {
            console.log("Error at deleting post image:",error?.message);
        }

        return res
                .status(200)
                .json({
                    message:"Post deleted successfully",
                    success:true
                })

    } catch (error) {
        console.log("Error at deleting post:",error?.message);
        return res
                .status(500)
                .json({
                    message:"Error at deleting post",
                    error:error?.message,
                    success:false
                })
    }
}

const getPostDetails = async (req,res) => {
    try {
        const {postId} = req.params;

        const post = await Post.findById(postId).populate("uploader");

        if(!post){
            return res
                    .status(404)
                    .json({
                        message:"Post not found",
                        success:false,
                    })
        }

        if(post.isDeleted){
            return res
                    .status(404)
                    .json({
                        message:"Post not found",
                        success:false,
                    })
        }

        const isLikedByUser = await PostLike.exists({
            post:postId,
            user:req.user._id
        })

        return res
                .status(200)
                .json({
                    message:"Post found",
                    data: {
                        imageURL:post.imageURL,
                        description:post.description,
                        uploaderFullName:post.uploader.fullname,
                        uploaderUsername:post.uploader.username,
                        uploaderId:post.uploader._id,
                        uploaderProfileImage:post.uploader.profileImage,
                        likeCount:post.likeCount,
                        commentsCount:post.commentsCount,
                        isLiked:isLikedByUser ? true : false
                    },
                    success:true,
                    postedAt:post.createdAt,
                })

    } catch (error) {
        console.log("Error at getting post details:",error?.message);
        return res
                .status(500)
                .json({
                    message:"Error at getting post details",
                    error:error?.message,
                    success:false
                })
    }
}

const getFeed = async (req,res) => {}

const getAllComents = async(req,res) => {}


export {createPost, deletePost, getPostDetails, getFeed, getAllComents}