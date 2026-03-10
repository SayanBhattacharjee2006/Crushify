import React from "react";
import { motion } from "motion/react";
import { timeAgo } from "../utils/timeAgo.js";
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

function ReplyCard({ comment, onLike, onUnLike, onReply }) {
    
    const [showAddRepliesInput, setShowAddRepliesInput] = React.useState(false);
    const [replyContent, setReplycontent] = React.useState("");
    const [isReplyAdding, setIsReplyAdding] = React.useState(false);
    const replyInputRef = React.useRef(null);

    const handleCommentLike = async () => {
        if (comment.isLikedByMe) {
            await onUnLike(comment._id);
        } else {
            await onLike(comment._id);
        }
    };


    const handleAddingComment = () => {
        if (
            !replyContent?.trim() ||
            replyContent.trim().length === 0 ||
            isReplyAdding
        )
            return;
        setIsReplyAdding(true);
        onReply( replyContent,comment.commentedBy._id);
        setReplycontent("");
        setIsReplyAdding(false);
        setShowAddRepliesInput(false);
    };

    return (
        <>
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
                        <div className="text-gray-800 dark:text-gray-200 flex gap-2">
                            {comment.repliedTo?.fullname && (
                                <span className="text-indigo-600">
                                    {`@${comment.repliedTo.fullname}`}
                                </span>
                            )}
                            <span>{comment.content}</span>
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
                            onClick={handleCommentLike}
                        >
                            {comment.isLikedByMe ? (
                                <AiFillLike />
                            ) : (
                                <AiOutlineLike />
                            )}
                            <span>{comment.likeCount}</span>
                        </div>
                        <button
                            onClick={() =>
                                setShowAddRepliesInput((prev) => !prev)
                            }
                            className="flex gap-1 items-center"
                        >
                            <FaComment />
                            <span>Reply</span>
                        </button>
                    </div>
                    {showAddRepliesInput && (
                        <motion.div
                            className=" flex items-center gap-2 py-2 "
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div className="flex-1">
                                <input
                                    value={replyContent}
                                    ref={replyInputRef}
                                    onChange={(e) =>
                                        setReplycontent(e.target.value)
                                    }
                                    placeholder={"Add a comment..."}
                                    className="outline-1 focus:outline-1 focus:outline-gray-400 outline-gray-300 w-full bg-gray-300 p-1 rounded-2xl text-gray-600 px-3 dark:outline-gray-500"
                                />
                            </motion.div>
                            {/* comment button */}
                            <motion.button
                                onClick={handleAddingComment}
                                className="bg-indigo-500 text-white px-4 py-1 rounded-2xl hover:text-blue-600 hover:bg-white hover:border hover:border-indigo-500 border border-transparent"
                                disabled={isReplyAdding}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <IoIosSend className="h-5 w-5" />
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ReplyCard;
