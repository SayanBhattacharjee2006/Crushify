import React from "react";
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { timeAgo } from "../utils/timeAgo.js";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { usePostStore } from "../stores/post.store.js";
import ReplyCard from "./ReplyCard.jsx";
import { motion } from "motion/react";
import { IoIosSend } from "react-icons/io";

function CommentCard({ comment, onLike, onUnLike }) {
    const replyInputRef = React.useRef(null);
    const [isCommentLikedByMe, setIsCommmentLikedByMe] = React.useState(
        comment.isLikedByMe,
    );
    const [replyCount, setReplyCount] = React.useState(comment.repliesCount);
    const [showAddRepliesInput, setShowAddRepliesInput] = React.useState(false);
    const [showAllReplies, setShowAllReplies] = React.useState(false);
    const [replyContent, setReplycontent] = React.useState("");
    const [isAddingReply, setIsAddingReply] = React.useState(false);

    const {
        getAllReplies,
        addComment,
        likeComment,
        unLikeComment,
        isReplyAlreadyFetched,
        isFetchingReplies,
    } = usePostStore();

    const replies = usePostStore(
        (state) => state.repliesByCommentId[comment._id],
    );

    React.useEffect(() => {
        setIsCommmentLikedByMe(comment.isLikedByMe);
    }, [comment.isLikedByMe]);

    React.useEffect(() => {
        setReplyCount(comment.repliesCount);
    }, [comment.repliesCount]);

    const handleAddingComment = async () => {
        if (
            !replyContent?.trim() ||
            replyContent.trim().length === 0 ||
            isAddingReply
        )
            return;
        setIsAddingReply(true);
        const res = await addComment(comment.post, {
            content: replyContent,
            repliedTo: comment.commentedBy._id,
            parentComment: comment._id,
        });
        if (res?.success) {
            setReplycontent("");
            setReplyCount((prev) => prev + 1);
            setShowAddRepliesInput(false);
            setShowAllReplies(true);
        }
        setIsAddingReply(false);
    };

    const handleShowingReplies = async () => {
        if (!showAllReplies) {
            if (
                !isFetchingReplies[comment._id] &&
                !isReplyAlreadyFetched[comment._id]
            ) {
                await getAllReplies(comment._id);
            }
            setShowAllReplies(true);
        } else {
            setShowAllReplies(false);
        }
    };

    const likeCommentHandler = async () => {
        if (isCommentLikedByMe) {
            await onUnLike(comment._id);
            setIsCommmentLikedByMe(false);
        } else {
            await onLike(comment._id);
            setIsCommmentLikedByMe(true);
        }
    };

    const replyLikeHandler = async (replyId) => {
        return likeComment(comment.post, replyId, comment._id);
    };

    const replyUnLikeHandler = async (replyId) => {
        return unLikeComment(comment.post, replyId, comment._id);
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
                <div className="flex gap-4 text-gray-500 dark:text-gray-500 pb-2">
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
                    <button
                        onClick={() => {
                            setShowAddRepliesInput((prev) => !prev);
                            setTimeout(
                                () => replyInputRef?.current?.focus(),
                                100,
                            );
                        }}
                        className="flex gap-1 items-center"
                    >
                        <FaComment />
                        <span>Reply</span>
                    </button>
                    {replyCount > 0 && (
                        <button
                            onClick={handleShowingReplies}
                            className="flex items-center text-indigo-500 gap-1"
                        >
                            <span className="flex items-baseline">
                                {showAllReplies ? (
                                    <IoIosArrowUp />
                                ) : (
                                    <IoIosArrowDown />
                                )}
                            </span>
                            <span>
                                {showAllReplies
                                    ? "Hide replies"
                                    : `View ${replyCount} replies`}
                            </span>
                        </button>
                    )}
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
                            disabled={isAddingReply}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <IoIosSend className="h-5 w-5" />
                        </motion.button>
                    </motion.div>
                )}
                {/* replies */}
                {showAllReplies &&
                    isReplyAlreadyFetched[comment._id] &&
                    replies &&
                    (replies.length === 0 ? (
                        <div className="text-gray-500 dark:text-gray-500">
                            No replies yet
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-2"
                        >
                            {replies.map((reply) => (
                                <ReplyCard
                                    key={reply._id}
                                    comment={reply}
                                    onLike={replyLikeHandler}
                                    onUnLike={replyUnLikeHandler}
                                />
                            ))}
                        </motion.div>
                    ))}
            </div>
        </div>
    );
}

export default CommentCard;
