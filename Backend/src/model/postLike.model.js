import mongoose from "mongoose";

const postLikeSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true,
    },
    likedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
}, {timestamps:true})

postLikeSchema.index({post:1,likedBy:1},{unique:true});

export const PostLike = mongoose.model("PostLike", postLikeSchema);
