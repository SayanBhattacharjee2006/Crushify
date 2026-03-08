import React from "react";
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { timeAgo } from "../utils/timeAgo.js";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { usePostStore } from "../stores/post.store.js";

function CommentCard({ comment, onLike, onUnLike }) {
    const [isCommentLikedByMe, setIsCommmentLikedByMe] = React.useState(
        comment.isLikedByMe,
    );
    const [showAddRepliesInput, setShowAddRepliesInput] = React.useState(false);
    const [showAllReplies, setShowAllReplies] = React.useState(false);
    const[replyContent, setReplycontent] = React.useState("");
    const [isAddingReply, setIsAddingReply] = React.useState(false);

    const {
        getAllReplies,
        addComment,
        likeComment,
        unLikeComment,
        repliesByCommentId,
        isReplyAlreadyFetched,
        isFetchingReplies,
    } = usePostStore();

    const handleAddingComment = async () => {
        if(!replyContent?.trim() || replyContent.trim().length === 0 || isAddingReply) return;
        setIsAddingReply(true);
        const res = await addComment(comment.post, { content: replyContent, repliedTo:comment.commentedBy._id,parentComment:comment._id });
        if (res?.success) {
            setReplycontent("");
            comment.repliesCount = comment.repliesCount + 1;
        }
        setIsAddingReply(false);
    }

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
                    <button
                        onClick={() => setShowAddRepliesInput((prev) => !prev)}
                        className="flex gap-1 items-center"
                    >
                        <FaComment />
                        <span>Reply</span>
                    </button>
                    {comment.repliesCount > 0 && (
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
                                    : `View ${comment.repliesCount} replies`}
                            </span>
                        </button>
                    )}
                </div>
                {showAddRepliesInput && (
                    <div className="flex gap-1">
                        <div className="flex-1 items-center pt-5">
                            <input
                                value={replyContent}
                                onChange={(e) => setReplycontent(e.target.value)}
                                placeholder={"Add a comment..."}
                                className="p-2 px-3 bg-gray-200 dark:bg-gray-800 w-full rounded-xl outline-1 outline-gray-400"
                            />
                        </div>
                        {/* comment button */}
                        <button
                            onClick={handleAddingComment}
                            className="px-3 text-white bg-indigo-500 rounded-xl"
                        >
                            Comment
                        </button>
                    </div>
                )}
                {/* replies */}
                {showAllReplies &&
                    isReplyAlreadyFetched[comment._id] &&
                    repliesByCommentId[comment._id] &&
                    (repliesByCommentId[comment._id].length === 0 ? (
                        <div className="text-gray-500 dark:text-gray-500">
                            No replies yet
                        </div>
                    ) : (
                        repliesByCommentId[comment._id].map((reply) => (
                            <CommentCard
                                key={reply._id}
                                comment={reply}
                                onLike={likeComment}
                                onUnLike={unLikeComment}
                            />
                        ))
                    ))}
            </div>
        </div>
    );
}

export default CommentCard;
