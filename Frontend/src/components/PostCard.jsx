import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { useAuthStore } from "../stores/auth.store.js";
import { useState } from "react";
import { usePostStore } from "../stores/post.store.js";
import { useNavigate } from "react-router-dom";
import React from "react";
import { motion } from "motion/react";
import { timeAgo } from "../utils/timeAgo.js";
import { Link } from "react-router-dom";

function PostCard({ post, onFollow, onUnFollow, onPostLike, onPostUnLike }) {
    const { user } = useAuthStore();
    const [isLikeUpdating, setIsLikeUpdating] = useState(false);
    const [isShowLikeAnimation, setisShowLikeAnimation] = useState(false);
    const [isFollowUpdating, setIsFollowUpdating] = useState(false);
    const navigate = useNavigate();


    console.log("Uploader: ", post.uploader);

    const handleFollow = async (e) => {
        if (isFollowUpdating) return;
        try {
            setIsFollowUpdating(true);
            if (post.isFollowingUploader) {
                await onUnFollow(post.uploader._id);
            } else {
                await onFollow(post.uploader._id);
            }
        } finally {
            setIsFollowUpdating(false);
        }
    };

    const handleLike = async (e) => {
        if (isLikeUpdating) return;
        try {
            setIsLikeUpdating(true);
            if (post.isLikedByMe) {
                await onPostUnLike(post._id);
            } else {
                await onPostLike(post._id);
                setisShowLikeAnimation(true);
                setTimeout(() => {
                    setisShowLikeAnimation(false);
                }, 700);
            }
        } finally {
            setIsLikeUpdating(false);
        }
    };

    const ClickLikeTrigger = () => {
        setisShowLikeAnimation(true);
        setTimeout(() => {
            setisShowLikeAnimation(false);
        }, 700);
    };

    const handleDblClickLike = async (e) => {
        try {
            ClickLikeTrigger();
            if (post.isLikedByMe || isLikeUpdating) return;
            setIsLikeUpdating(true);
            await onPostLike(post._id);
        } finally {
            setIsLikeUpdating(false);
        }
    };


    return (
        <div className="border p-4 rounded-2xl border-gray-200 dark:border-gray-600 shadow-md flex flex-col gap-3 dark:shadow-gray-800">
            {/* uploader Information */}
            <div className="flex justify-between items-center w-full px-2 ">
                {/* uploader profile pic and name */}
                <Link to={`/app/profile/${post?.uploader?._id}`} className="flex gap-2 justify-center text-center items-center">
                    <motion.div
                     
                     onClick={()=>navigate(`/app/post/${post._id}`)}
                     className="rounded-full w-10 h-10 overflow-hidden object-cover ring-1 ring-gray-200"
                    >
                        <motion.img
                            src={post?.uploader?.avatarURL}
                            alt="post uploader profile pic"
                            className="w-full h-full"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            loading="lazy"
                        />
                    </motion.div>
                    <Link to={`/app/profile/${post?.uploader?._id}`} className="flex flex-col items-start px-1 md:px-2">
                        <span className="font-semibold text-lg md:text-xl leading-5">
                            {post?.uploader?.fullname}
                        </span>
                        <span className="text-sm text-gray-500">
                            @{post?.uploader?.username || "username"}
                        </span>
                    </Link>
                </Link>
                {/* follow unfollow button */}
                {post?.uploader?._id !== user._id && (
                    <div className="text-lg md:text-xl">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className={`cursor-pointer outline-1 rounded-2xl py-1 px-4 hover:bg-indigo-600 hover:text-white hover:font-semibold hover:outline-2 transition-all duration-100 ease-in hover:outline-offset-2 text-sm md:text-lg ${post?.isFollowingUploader ? "text-gray-500 outline-gray-500 hover:outline-indigo-600" : "bg-white text-indigo-600  border border-indigo-600 outline-indigo-600"}`}
                            onClick={handleFollow}
                            disabled={isFollowUpdating}
                        >
                            {post?.isFollowingUploader ? "Following" : "Follow"}
                        </motion.button>
                    </div>
                )}
            </div>

            <div className="w-full border border-gray-200 dark:border-gray-600"></div>

            {/* post description */}

            <div className="px-2 wrap-break-word dark:text-gray-200 text-gray-700">
                {post.description ||
                    "cwoeghwheohihvwohvnoreghi3ghihihihihvarnihiog4h cwekfiwjgj3qgojp"}
            </div>

            {/* post image */}
            {post.imageURL && (
                <div
                    onDoubleClick={handleDblClickLike}
                    className="rounded-2xl overflow-hidden relative"
                >
                    {isShowLikeAnimation && (
                        <div>
                            <AiFillLike
                                fill="blue"
                                className="like-pop  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50  h-25 w-25"
                            />
                            {/* <AiFillLike fill="blue" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-z-50 transition-all duration-300 ease-in-out h-25 w-25 flex justify-center items-center" /> */}
                        </div>
                    )}

                    <img
                        src={post.imageURL}
                        loading="lazy"
                        alt="post image"
                        className="mx-auto"
                        draggable={false}
                    />
                </div>
            )}
            <div className="w-full border border-gray-200 dark:border-gray-600"></div>
            {/* like and comment */}
            <div className="flex  justify-between px-2 items-center">
                <div className="flex items-center gap-5 text-lg text-gray-600 dark:text-gray-400">
                    <span>{post.likeCount + " likes"}</span>
                    <span>{post.commentsCount + " comments"}</span>
                </div>
                <div className="flex items-start gap-5 text-xl md:text-2xl ">
                    <div className="flex gap-2 cursor-pointer">
                        <motion.button
                            className={`cursor-pointer p-2 px-5 justify-center text-sm md:text-lg rounded-3xl flex items-center gap-1  dark:hover:bg-gray-800 dark:outline-1 dark:outline-gray-600 hover:outline-indigo-300 hover:outline-2 hover:outline-offset-2 hover:text-indigo-300 transition-all duration-100 ease-in-out outline-1  ${post.isLikedByMe ? "outline-indigo-300" : "outline-gray-300 dark:outline-gray-600"} `}
                            onClick={handleLike}
                            whileTap={{scale:0.9}}
                            disabled={isLikeUpdating}
                        >
                            {post.isLikedByMe ? (
                                <AiFillLike fill={"blue"} />
                            ) : (
                                <AiOutlineLike />
                            )}
                            <span>Like</span>
                        </motion.button>
                    </div>
                    <div className="flex gap-2 cursor-pointer">
                        <motion.button
                            whileTap={{scale:0.9}}
                            onClick={() => navigate(`/app/post/${post._id}`)}
                            className={`cursor-pointer p-2 rounded-3xl flex gap-2 items-center text-sm md:text-lg dark:hover:bg-gray-800 dark:outline-1 dark:outline-gray-600 hover:outline-indigo-300 hover:outline-2 hover:outline-offset-2 hover:text-indigo-300 transition-all duration-100 ease-in-out outline-1  ${post.isLikedByMe ? "outline-indigo-300" : "outline-gray-300 dark:outline-gray-600"} `}
                        >
                            <FaComment />
                            <span>Comment</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(PostCard);
