import React from "react";
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { timeAgo } from "../utils/timeAgo.js";
import { IoIosArrowDown } from "react-icons/io";

function CommentCard({ comment, onLike, onUnLike }) {
    const [isCommentLikedByMe, setIsCommmentLikedByMe] = React.useState(
        comment.isLikedByMe,
    );

    const likeCommentHandler = async () => {
        console.log("clicked");
        if (isCommentLikedByMe) {
            await onUnLike(comment._id);
            setIsCommmentLikedByMe(false);
        } else {
            await onLike(comment._id);
            setIsCommmentLikedByMe(true);
        }
    };

    return (
        <div className="flex items-start w-full gap-4 ">
            {/* profile pic */}
            <div className="rounded-full w-10 h-10 overflow-hidden object-cover ring-1 ring-gray-200">
                <img
                    src={comment.commentedBy.avatarURL}
                    alt="post uploader profile pic"
                    className="w-full h-full"
                    loading="lazy"
                />
            </div>
            {/* comment */}
            <div className="p-2 px-3 bg-gray-200 dark:bg-gray-800 w-full rounded-xl">
                <div>
                    <div className="font-semibold">
                        {comment.commentedBy.fullname}
                    </div>
                    <div className="text-gray-800 dark:text-gray-200">
                        {comment.content}
                    </div>
                </div>
                <div className="flex gap-4 text-gray-500 dark:text-gray-500">
                    <div>
                        <span className=" text-sm">
                            {timeAgo(comment.createdAt)}
                        </span>
                    </div>
                    <div
                        className="flex gap-1 items-center "
                        onClick={likeCommentHandler}
                    >
                        {isCommentLikedByMe ? (
                            <AiFillLike />
                        ) : (
                            <AiOutlineLike />
                        )}
                        <span>{comment.likeCount}</span>
                    </div>
                    <button className="flex gap-1 items-center">
                        <FaComment />
                        <span>Reply</span>
                    </button>
                    {comment.repliesCount > 0 && (
                        <button className="flex items-center text-indigo-500 gap-1">
                            <span className="flex items-baseline">
                                <IoIosArrowDown />
                            </span>
                            <span>{comment.repliesCount + " replies"}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CommentCard;
