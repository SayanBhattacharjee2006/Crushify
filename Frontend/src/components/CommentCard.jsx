import React from "react";
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";

function CommentCard({ comment }) {
    return (
        <div className="flex items-start w-full gap-4 ">
            <div className="rounded-full w-10 h-10 overflow-hidden object-cover ring-1 ring-gray-200">
                <img
                    src={comment.commentedBy.avatarURL}
                    alt="post uploader profile pic"
                    className="w-full h-full"
                    loading="lazy"
                />
            </div>
            <div className="p-2 px-3 bg-gray-200 dark:bg-gray-800 w-full rounded-xl">
                <div>
                    <div className="font-semibold">{comment.commentedBy.fullname}</div>
                    <div className="text-gray-800 dark:text-gray-200">{comment.content}</div>
                </div>
                <div className="flex gap-3">
                    <div className="flex gap-1 items-center">
                        <AiFillLike />
                        <span>{comment.likeCount}</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <FaComment />
                        <span>{comment.repliesCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentCard;
