import { FaArrowLeft } from "react-icons/fa";
import React from "react";
import { useParams , useNavigate} from "react-router-dom";
import { usePostStore } from "../stores/post.store.js";
import PostCard from "../components/PostCard.jsx";
import { useAuthStore } from "../stores/auth.store.js";
import CommentCard from "../components/CommentCard.jsx";
function PostDetails() {
    const { getPostDetails, isLoading, addComment, getAllComments } =
        usePostStore();
    const [commentContent, setCommentContent] = React.useState("");
    const [isCommentAdding, setIsCommentAdding] = React.useState(false);
    const [allComments, setAllComments] = React.useState([]);
    const [lastCommentId, setLastCommentId] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [post, setPost] = React.useState(null);
    const { user } = useAuthStore();
    const { id } = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchPostDetails = async () => {
            const [postResponse, commentResponse] = await Promise.all([
                getPostDetails(id),
                getAllComments(id, lastCommentId),
            ])
            
            // console.log(res);
            // console.log(commentResponse);
            setAllComments(commentResponse.comments);
            setLastCommentId(commentResponse.pagination.lastCommentId);
            setPost(postResponse.post);
        };

        fetchPostDetails();
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentContent?.trim() || commentContent.trim().length === 0)
            return;
        try {
            setIsCommentAdding(true);

            const res = await addComment(id, {
                content: commentContent,
            });

            if (res?.success) {
                setCommentContent("");
                setPost((prev) => ({
                    ...prev,
                    commentsCount: prev.commentsCount + 1,
                }));
                setAllComments((prev) => [ res.comment,...prev]);
            }

            console.log(res);
        } finally {
            setIsCommentAdding(false);
        }
    };
    const handleInputChange = (e) => {
        setCommentContent(e.target.value);
    };
    return (
        <div className="flex justify-center items-center flex-col gap-5">
            {/* back button */}
            <div className="w-full leading-0 mt-3">
                <button 
                onClick={() => navigate("../home")} className="flex gap-1 items-center hover:bg-gray-600 rounded-2xl p-2" >
                    <FaArrowLeft />
                    <span>
                         Back to feed
                    </span>
                </button>
            </div>
            {/* post */}
            {isLoading || !post ? <p>Loading...</p> : <PostCard post={post} />}

            {/* add comment */}
            <div className="flex gap-2 w-full items-center border p-4 rounded-2xl border-gray-200 dark:border-gray-600 shadow-md   dark:shadow-gray-800">
                {/* profile pic */}
                <div className="rounded-full w-10 h-10 overflow-hidden object-cover ring-1 ring-gray-200">
                    <img
                        src={user?.avatarURL}
                        alt="post uploader profile pic"
                        className="w-full h-full"
                    />
                </div>
                {/* comment input */}
                <div className="flex-1 items-center">
                    <input
                        value={commentContent}
                        placeholder={"Add a comment..."}
                        onChange={handleInputChange}
                        className="rounded-2xl p-2 bg-gray-200 dark:bg-gray-700 w-full dark:text-white dark:placeholder-gray-400 focus:outline dark:focus:outline-gray-300 text-gray-500 placeholder-gray-500 focus:outline-indigo-500"
                    />
                </div>
                {/* comment button */}
                <button
                    onClick={handleAddComment}
                    disabled={!commentContent?.trim() || isCommentAdding}
                    className="rounded-2xl bg-indigo-600 p-2 text-white disabled:bg-indigo-400 disabled:cursor-not-allowed font-semibold text-sm"
                >
                    {isCommentAdding ? "Adding..." : "Add Comment"}
                </button>
            </div>

            {/* comment list */}
            <div className="w-full p-3 flex flex-col gap-5 rounded-2xl shadow-md dark:shadow-gray-800 border border-gray-200 dark:border-gray-600">
                <div className="flex gap-3 items-baseline" >
                    <span className="text-xl font-semibold">COMMENTS</span>
                    <span className="text-gray-400">{"(" + post?.commentsCount + ")"}</span>
                </div>
                {allComments && allComments.length === 0 ? 
                    <p className="text-gray-400">No comments yet</p> :
                    allComments.map((comment) => (
                        <CommentCard  key={comment._id} comment={comment} />
                    ))}
            </div>
        </div>
    );
}

export default PostDetails;
