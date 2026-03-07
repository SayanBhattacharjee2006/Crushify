import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    commentedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index: true,
    },
    content:{
        type: String,
        required: true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true,
        index: true
    },
    parentComment:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        index: true,
        default: null
    },
    repliedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null,
        index:true
    },
    likeCount:{
        type: Number,
        default:0
    },
    repliesCount:{
        type: Number,
        default:0
    },
    isDeleted:{
        type: Boolean,
        default:false
    }
},
{timestamps: true})

commentSchema.index({post:1,parentComment:1,createdAt: -1});

export const Comment = mongoose.model("Comment", commentSchema);

