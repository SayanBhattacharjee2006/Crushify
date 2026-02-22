import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    uploader:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    description:{
        type:String,
    },
    imageURL:{
        type: String,
    },
    imagePublicId:{
        type: String
    },
    likeCount:{
        type: Number,
        default:0
    },
    commentsCount:{
        type: Number,
        default:0
    },
    isDeleted:{
        type: Boolean,
        default:false
    }
},
{
    timestamps:true
})


export const Post = mongoose.model("Post", postSchema);