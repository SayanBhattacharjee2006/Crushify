import mongoose from "mongoose";
import { Follow } from "../model/follow.model.js";
import { User } from "../model/user.model.js";

const followUser = async (req, res) => {
    try {
        const followerId = req.user._id;
        const followingId = new mongoose.Types.ObjectId(req.params.id);

        console.log("followerId:",followerId);
        console.log("followingId:",followingId);

        // check if the user is trying to follow themselves

        if (followerId.equals(followingId)) {
            return res.status(400).json({
                message: "You cannot follow youerself",
                success: false,
            });
        }

        const isFollowingUserExist = await User.exists({ _id: followingId });

        if (!isFollowingUserExist) {
            return res.status(404).json({
                message: "The user you are trying to follow does not exist",
                success: false,
            });
        }

        await Follow.create({
            follower: followerId,
            following: followingId,
        });

        await Promise.all([
                User.findByIdAndUpdate(followerId, {
                    $inc: { followingCount: 1 },
                }, { new: true }),
                User.findByIdAndUpdate(followingId, {
                    $inc: { followersCount: 1 },
                }, { new: true }),
        ]);

        return res.status(200).json({
            message: "User followed successfully",
            success: true,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You are already following this user",
                success: false,
            });
        }
        console.log("Error at follow user: ", error?.message);
        return res.status(500).json({
            message: "Error occured while following the user",
            error: error?.message,
            success: false,
        });
    }
};
const unFollowUser = async (req, res) => {
    try {
        const followerId = req.user._id;
        const followingId = new mongoose.Types.ObjectId(req.params.id);

        if (followerId.equals(followingId)) {
            return res.status(400).json({
                message: "You cannot unfollow yourself mf",
                success: false,
            });
        }

        const deletedFollow = await Follow.deleteOne({
            follower: followerId,
            following: followingId,
        });

        if (deletedFollow.deletedCount === 0) {
            return res.status(400).json({
                message: "You are not following this user",
                success: false,
            });
        }

        await Promise.all([
            User.findByIdAndUpdate(followerId, {
                $inc: { followingCount: -1 },
            }),
            User.findByIdAndUpdate(followingId, {
                $inc: { followersCount: -1 },
            }),
        ]);

        return res.status(200).json({
            message: "User unfollowed successfully",
            success: true,
        });
    } catch (error) {
        console.log("Error at unfollow user:", error?.message);
        return res.status(500).json({
            message: "Error occured while unfollowing the user",
            error: error?.message,
            success: false,
        });
    }
};
const getAllFollowers = async (req, res) => {
    try {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message:"Invalid user id",
                success:false
            })
        }

        const userObjectId = new mongoose.Types.ObjectId(id);

        const allFollower = await Follow.aggregate([
            {
                $match: { following: userObjectId },
            },
            {
                $lookup:{
                    from:"users",
                    let:{follower:"$follower"},
                    pipeline:[
                        {
                            $match:{$expr:{$eq:["$_id","$$follower"]}}
                        },
                        {
                            $project:{
                                _id:1,
                                fullname:1,
                                username:1,
                                avatarURL:1,
                                followersCount:1
                            }
                        }
                    ],
                    as:"follower"
                }
            },
            {
                $unwind:"$follower",
            },
            {
                $project: {
                    _id:"$follower._id",
                    fullname:"$follower.fullname",
                    username:"$follower.username",
                    avatarURL:"$follower.avatarURL",
                    followersCount:"$follower.followersCount"
                },
            }
        ])

        return res
                .status(200)
                .json({
                    message:"All followers fetched successfully",
                    followers:allFollower,
                    success:true,
                })

        
    } catch (error) {
        console.log("Error at get all follower:", error?.message);
        return res
                .status(500)
                .json({
                    message:"Error occured while fetching all followers",
                    success:false
                })
    }
};

const getAllFollowing = async (req, res) => {
    try {
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message:"Invalid user id",
                success:false
            })
        }

        const userObjectId = new mongoose.Types.ObjectId(id);


        const allFollowing = await Follow.aggregate([
            {
                $match: { follower: userObjectId },
            },
            {
                $lookup: {
                    from: "users",
                    let:{following:"$following"},
                    pipeline:[
                        {
                            $match:{$expr:{$eq:["$_id","$$following"]}}
                        },
                        {
                            $project:{
                                _id:1,
                                fullname:1,
                                followersCount:1,
                                username:1,
                                avatarURL:1,
                            }
                        }
                    ],
                    as:"following",
                },
            },
            {
                $unwind: "$following",
            },
            {
                $project: {
                    _id:"$following._id",
                    fullname:"$following.fullname",
                    followersCount:"$following.followersCount",
                    username:"$following.username",
                    avatarURL:"$following.avatarURL",
                },
            },
        ]);

        return res
                .status(200)
                .json({
                    message:"All following fetched successfully",
                    followings:allFollowing,
                    success:true,
                })
    } catch (error) {
        console.log("Error at get all following:", error?.message);
        return res
                .status(500)
                .json({
                    message:"Error occured while fetching all following",
                    success:false
                })
    }
};

const getFollowStatus = async (req, res) => {
    try {

        const userId = req.user._id;
        const followingId = new mongoose.Types.ObjectId(req.params.id);

        const isFollowing = await Follow.exists({
            follower:userId,
            following: followingId
        })

        return res
                .status(200)
                .json({
                    message:"Follow status fetched successfully",
                    data:!!isFollowing,
                    success:true
                })
    } catch (error) {
        console.log("Error at get follow status:", error?.message);
        return res
                .status(500)
                .json({
                    message:"Error occured while fetching follow status",
                    success:false
                })
    }
};

export {
    followUser,
    unFollowUser,
    getFollowStatus,
    getAllFollowers,
    getAllFollowing,
};

// 69874bcddfa3a7420b0949a3