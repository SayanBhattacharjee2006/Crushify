import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { useAuthStore } from "../stores/auth.store.js";
import { useState } from "react";
import { usePostStore } from "../stores/post.store.js";
import {useNavigate} from "react-router-dom"
import React from "react";

function PostCard({ post}) {
    const { user, followUser, unfollowUser } = useAuthStore();
    const { toggleFollowStatus, postLike, postUnLike } = usePostStore();
    const [isLikeUpdating, setIsLikeUpdating] = useState(false);
    const [isShowLikeAnimation, setisShowLikeAnimation] = useState(false);
    const [isFollowUpdating, setIsFollowUpdating] = useState(false);
    const navigate = useNavigate();

    const handleUnfollow = async (e) => {
        try{
            if(isFollowUpdating) return;
            setIsFollowUpdating(true);
            const response = await unfollowUser(post.uploader._id);
            if(response.success){
                toggleFollowStatus(post.uploader._id)
            }
        }finally{
            setIsFollowUpdating(false);
        }
        
    };

    const handleFollow = async (e) => {
        try{
            if(isFollowUpdating) return;
            setIsFollowUpdating(true);
            const response = await followUser(post.uploader._id);
            
            if(response.success){
                toggleFollowStatus(post.uploader._id)
            }
        }finally{
            setIsFollowUpdating(false);
        }
    };

    const handleLike = async (e) => {
        try{
            if(isLikeUpdating) return;
            if(!post.isLikedByMe) ClickLikeTrigger();
            setIsLikeUpdating(true);
            const response = await postLike(post._id);
        }finally{
            setIsLikeUpdating(false);
        }
        
    }
    
    const handleUnlike = async (e) => {
       try{
           setIsLikeUpdating(true);
           const response = await postUnLike(post._id);
       }finally{
           setIsLikeUpdating(false);
       }
    }


    const ClickLikeTrigger = () => {
        setisShowLikeAnimation(true);
        setTimeout(() => {
            setisShowLikeAnimation(false);
        }, 700);
    }

    const handleDblClickLike = async (e) =>{
        try{
            ClickLikeTrigger();
            if(post.isLikedByMe || isLikeUpdating) return ;
            setIsLikeUpdating(true);
            const response = await postLike(post._id);
        }finally{
            setIsLikeUpdating(false);
        }
    }

    return (
        <div className="border p-4 rounded-2xl border-gray-200 dark:border-gray-600 shadow-md flex flex-col gap-3 dark:shadow-gray-800">
            {/* uploader Information */}
            <div className="flex justify-between items-center w-full px-2 ">
                {/* uploader profile pic and name */}
                <div className="flex gap-2 justify-center text-center items-center">
                    <div className="rounded-full w-10 h-10 overflow-hidden object-cover ring-1 ring-gray-200">
                        <img
                            src={post?.uploader?.avatarURL}
                            alt="post uploader profile pic"
                            className="w-full h-full"
                            // onClick={()=>navigate(`/app/post/${post._id}`)}
                        />
                    </div>
                    <div className="flex flex-col items-start px-1 md:px-2">
                        <span className="font-semibold text-lg md:text-xl leading-5">
                            {post?.uploader?.fullname}
                        </span>
                        <span className="text-sm text-gray-500">
                            @{post?.uploader?.username || "username"}
                        </span>
                    </div>
                </div>
                {/* follow unfollow button */}
                {post?.uploader?._id !== user._id && (
                    <div className="text-lg md:text-xl">
                        {post?.isFollowingUploader ? (
                            <button
                                className="px-4 md:px-6 cursor-pointer md:py-1 bg-indigo-600 text-white rounded-lg"
                                onClick={handleUnfollow}
                                disabled={isFollowUpdating}
                            >
                                unfollow
                            </button>
                        ) : (
                            <button
                                className="px-4 md:px-6 md:py-1 bg-indigo-600 text-white cursor-pointer rounded-lg"
                                onClick={handleFollow}
                                disabled={isFollowUpdating}
                            >
                                follow
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="w-full border border-gray-200 dark:border-gray-600"></div>

            {/* post description */}
            
            <div className="px-2 wrap-break-word">
                {post.description ||
                    "cwoeghwheohihvwohvnoreghi3ghihihihihvarnihiog4h cwekfiwjgj3qgojp"}
            </div>
        
            {/* post image */}
            {post.imageURL && (
                <div
                    onDoubleClick={handleDblClickLike} 
                    className="rounded-2xl overflow-hidden relative"
                >
                    {
                        isShowLikeAnimation && (
                            <div >
                                <AiFillLike fill="blue" className="like-pop  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50  h-25 w-25" />
                                {/* <AiFillLike fill="blue" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-z-50 transition-all duration-300 ease-in-out h-25 w-25 flex justify-center items-center" /> */}
                            </div>
                        )
                    }
                    
                    <img src={post.imageURL} loading="lazy" alt="post image" className="" draggable={false} />
                </div>
            )}
            <div className="w-full border border-gray-200 dark:border-gray-600"></div>
            {/* like and comment */}
            <div className="flex items-start gap-5 text-xl md:text-2xl px-2 ">
                <div className="flex gap-2 cursor-pointer">
                    {
                        post.isLikedByMe? (
                            <button
                                    className="cursor-pointer"
                                    onClick={handleUnlike}
                                    disabled={isLikeUpdating}
                                    >
                                <AiFillLike fill="blue"/>
                            </button>
                        ) : (
                            <button
                                className="cursor-pointer"
                                onClick={handleLike}
                                disabled={isLikeUpdating}
                            > 
                                <AiOutlineLike />
                            </button>
                        )
                    }
                    <span>{post.likeCount}</span>
                </div>
                <div className="flex gap-2 cursor-pointer">
                    <button
                        onClick={() => navigate(`/app/post/${post._id}`)}
                        className="cursor-pointer"
                        >
                        <FaComment />
                    </button>
                    <span>{post.commentsCount}</span>
                </div>
            </div>
        </div>
    );
}

export default React.memo(PostCard);
