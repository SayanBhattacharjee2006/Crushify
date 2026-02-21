import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { DEFAULT_AVATAR_URL } from "../constants/default_url.js";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        username:{
            type:String,
            default:"",
            lowercase:true,
        },
        pronouns:{
            type: String,
            enum:["he/him","she/her","they/them","ze/zir","other",""],
        },
        age:{
            type:Number,
        },
        phoneNumber:{
            type: String,
        },
        gender:{
            type: String,
            enum:["male","female","other",""],
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            select: false,
        },
        bio:{
            type: String,
            default:"",
            max:100,
        },
        googleID: {
            type: String,
            sparse: true,
        },
        githubID: {
            type: String,
            sparse: true,
        },
        provider: {
            type: String,
            enum: ["local", "google", "github"],
            default: "local",
        },
        followersCount: {
            type: Number,
            default: 0,
        },
        followingCount: {
            type: Number,
            default: 0,
        },
        avatarURL: {
            type: String,
            default:DEFAULT_AVATAR_URL,
                
        },
        avatarPublicId: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);


