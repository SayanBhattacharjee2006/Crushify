import { User } from "../model/user.model.js";
import uploadImage from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import { DEFAULT_AVATAR_URL } from "../constants/default_url.js";
import { PostLike } from "../model/postLike.model.js";
import mongoose from "mongoose";

const setAvatar = async (req, res) => {
    try {
        const userId = req.user._id;

        const filePath = req.file?.path;

        if (filePath) {
            const response = await uploadImage(filePath);
            // console.log("Response:",response);
            if (!response) {
                console.log("Error at uploading avatar1:", error?.message);
                return res.status(500).json({
                    message: "Error at uploading avatar",
                    success: false,
                });
            }

            const user = await User.findById(userId).select("-password");

            if (user.avatarPublicId) {
                await cloudinary.uploader.destroy(user.avatarPublicId);
            }

            user.avatarURL = response.secure_url;
            user.avatarPublicId = response.public_id;
            await user.save();

            return res.status(200).json({
                message: "Avatar uploaded successfully",
                success: true,
                user,
            });
        }

        return res.status(400).json({
            message: "No avatar file uploaded",
            success: false,
        });
    } catch (error) {
        console.log("Error at uploading avatar:", error?.message);
        return res.status(500).json({
            message: "Error at uploading avatar",
            error: error?.message,
            success: false,
        });
    }
};

const deleteAvatar = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        if (!user.avatarPublicId) {
            return res.status(200).json({
                message: "avatar already is set to default",
                success: true,
            });
        }

        await cloudinary.uploader.destroy(user.avatarPublicId);

        user.avatarURL = DEFAULT_AVATAR_URL;
        user.avatarPublicId = null;
        await user.save();

        return res.status(200).json({
            message: "Avatar deleted successfully",
            success: true,
            user,
        });
    } catch (error) {
        console.log("Error at deleting avatar:", error?.message);
        return res.status(500).json({
            message: "Error at deleting avatar",
            error: error?.message,
            success: false,
        });
    }
};

const completeProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { username, bio, pronouns, phoneNumber, gender, age } = req.body;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        user.username = username;
        user.bio = bio;
        user.pronouns = pronouns;
        user.phoneNumber = phoneNumber;
        user.gender = gender;
        user.age = age;
        await user.save();

        return res.status(200).json({
            message: "Profile completed successfully",
            success: true,
            user,
        });
    } catch (error) {
        console.log("Error at completing profile:", error?.message);
        return res.status(500).json({
            message: "Error at completing profile",
            error: error?.message,
            success: false,
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const isUserExist = await User.exists({ _id: userId });

        if (!isUserExist) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        const { fullName, bio, pronouns, phoneNumber, gender, age, username } =
            req.body;

        if (!fullName) {
            return res.status(400).json({
                message: "Full name is required",
                success: false,
            });
        }

        //check is user exist with username

        const isUsernameAlreadyExist = await User.exists({
            username,
            _id: { $ne: userId },
        });

        if (isUsernameAlreadyExist) {
            return res.status(400).json({
                message: "Username already exist",
                success: false,
            });
        }

        const updaterUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    fullname: fullName,
                    bio,
                    pronouns,
                    phoneNumber,
                    gender,
                    age,
                    username,
                },
            },
            {
                new: true,
                select: "-password",
            },
        );

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user: updaterUser,
        });
    } catch (error) {
        console.log("Error at updating profile:", error?.message);
        return res.status(500).json({
            message: "Error at updating profile",
            error: error?.message,
            success: false,
        });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user id",
                success: false,
            });
        }

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "User data retreived successfully",
            user,
            success: true,
        });
    } catch (error) {
        console.log("Error at getting user details:", error?.message);
        return res.status(500).json({
            message: "Error at getting user details",
            error: error?.message,
            success: false,
        });
    }
};

const getAllPostsByUserId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user id",
                success: false,
            });
        }

        const userId = new mongoose.Types.ObjectId(id);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

        const allPosts = await Post.aggregate([
            {
                $match: {
                    uploader: userId,
                    isDeleted: false,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { uploaderId: "$uploader" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$uploaderId"],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                avatarURL: 1,
                                fullname: 1,
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
                $project: {
                    _id: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    commentsCount: 1,
                    likeCount: 1,
                    uploader: 1,
                    imageURL: 1,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]);

        return res.status(200).json({
            message: "Posts retreived successfully",
            allPosts,
            page: page,
            limit: limit,
            hasMore: allPosts.length === limit,
            success: true,
        });
    } catch (error) {
        console.log("Error at getting all posts by user id:", error?.message);
        return res.status(500).json({
            message: "Error at getting all posts by user id",
            error: error?.message,
            success: false,
        });
    }
};

const getAllLikedPosts = async (req, res) => {
    try {
        const id = req.user._id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

        const allPosts = await PostLike.aggregate([
            {
                $match: {
                    likedBy: id,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $lookup: {
                    from: "posts",
                    let: { postId: "$post" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$postId"],
                                },
                                isDeleted: false,
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                description: 1,
                                imageURL: 1,
                                likeCount: 1,
                                commentsCount: 1,
                            },
                        },
                    ],
                    as: "post",
                },
            },
            {
                $unwind: "$post",
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]);

        return res.status(200).json({
            message: "all liked posts fetched successfully",
            allPosts,
            limit,
            page,
            hasMore: allPosts.length === limit,
            success: true,
        });
    } catch (error) {
        console.log(
            "Error at fetching all liked posts by user",
            error?.message,
        );
        return res.status(500).json({
            message: "Error at fetching all liked posts by user",
            success: false,
        });
    }
};

export {
    setAvatar,
    deleteAvatar,
    completeProfile,
    updateProfile,
    getUserDetails,
    getAllPostsByUserId,
    getAllLikedPosts,
};
