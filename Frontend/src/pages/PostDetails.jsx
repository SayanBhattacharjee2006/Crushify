import React from "react";
import { useParams } from "react-router-dom";
import { usePostStore } from "../stores/post.store.js";
import PostCard from "../components/PostCard.jsx";
import Input from "../components/Input.jsx";
import { useAuthStore } from "../stores/auth.store.js";

function PostDetails() {
    const { id } = useParams();
    const { getPostDetails, isLoading, addComment } = usePostStore();
    const [post, setPost] = React.useState(null);
    const [commentContent, setCommentContent] = React.useState("");
    const [error, setError] = React.useState(null);
    const [isCommentAdding, setIsCommentAdding] = React.useState(false);
    const { user } = useAuthStore();

    React.useEffect(() => {
        const fetchPostDetails = async () => {
            const res = await getPostDetails(id);
            console.log(res);
            setPost(res.post);
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
            {/* post */}
            {isLoading || !post ? <p>Loading...</p> : 
            <PostCard post={post} />}

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
        </div>
    );
}

export default PostDetails;
