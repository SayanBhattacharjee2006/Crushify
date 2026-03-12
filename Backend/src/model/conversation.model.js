import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    lastMessage: {
        content: {
            type: String,
            default: "",
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        seenBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        timestamp: {
            type: Date,
        },
    },
    unreadCount:{
        type: Map,
        of: Number,
        default:{}
    }
},
{
    timestamps: true
});

conversationSchema.index({ participants: 1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);