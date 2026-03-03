import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useAuthStore } from "../stores/auth.store.js";
import { RxCross1 } from "react-icons/rx";
import { usePostStore } from "../stores/post.store.js";

function PostPage() {
    const fileInputRef = useRef(null);
    const { uploadPost, isLoading } = usePostStore();
    const navigate = useNavigate();

    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [error, setError] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setError("");
        if (file.size > 10 * 1024 * 1024) {
            setError("File size should be less than 10MB");
            return;
        }
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file");
            return;
        }
        const newPreviewURL = URL.createObjectURL(file);
        if (previewURL) URL.revokeObjectURL(previewURL);
        setImage(file);
        setPreviewURL(newPreviewURL);
        e.target.value = null;
    };

    const handlePostUpload = async (e) => {
        e.preventDefault();
        if (!image && !description.trim()) {
            setError("Post must contain image or description");
            return;
        }

        const res = await uploadPost(image, description);

        if (!res.success) {
            setError(res.error);
            return;
        }

        if (res.success) {
            setError("");
            if(previewURL)URL.revokeObjectURL(previewURL);
            setPreviewURL(null);
            setImage(null);
            setDescription("");
            navigate("/app/home");
        }
    };

    const handlePostDiscard = (e) => {
        e.preventDefault();
        if (previewURL) {
            URL.revokeObjectURL(previewURL);
        }

        setPreviewURL(null);
        setImage(null);
        setDescription("");
        setError("");
        navigate("/app/home");
    };

    const handleDragOver = (e) =>{
        e.preventDefault();
        setIsDragOver(true);
    }

    const handleOnDrop = (e) =>{
        e.preventDefault();
        setIsDragOver(false);

        const file = e.dataTransfer.files[0];
        if(!file)return;
        setError("");
        if(file.size > 10 * 1024 * 1024){
            setError("File size should be less than 10MB");
            return ;
        }
        if(!file.type.startsWith("image/")){
            setError("Please select a valid image file");
            return;
        }

        const newPreviewURL = URL.createObjectURL(file);
        if (previewURL) URL.revokeObjectURL(previewURL);
        setImage(file);
        setPreviewURL(newPreviewURL);
        e.target.value = null;
    }

    return (
        <div className=" min-w-full p-5  flex items-center ">
            <div className="dark:text-white dark:bg-gray-600 shadow-md rounded-xl bg-zinc-50 flex flex-col gap-3 items-center p-5 mx-auto sm:min-w-120 md:min-w-150">
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    disabled={previewURL || isLoading}
                />
                {/* heading */}
                <div className="flex flex-col items-center border-b-2 border-gray-400 p-2 gap-2">
                    <span className="text-3xl font-semibold">
                        Create New Post
                    </span>
                    <span className="text-gray-500 dark:text-gray-200 text-sm">
                        Share your latest thoughts and images with the community
                    </span>
                </div>
                {error && <span className="text-red-500">{error}</span>}
                {/* Caption */}
                <div className="flex flex-col items-start gap-2 p-2 min-w-full">
                    <label htmlFor="caption">Caption/ Description:</label>
                    <textarea
                        name="caption"
                        id="caption"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border scrollbar-hide dark:bg-gray-600 w-full h-25 resize-none p-2 border-gray-400 rounded-md"
                        placeholder="What's on your mind"
                    ></textarea>
                </div>
                {/* Image */}
                <div className="flex flex-col items-start gap-2 p-2 min-w-full">
                    <span>Media:</span>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer border border-gray-400 rounded-md p-2 flex items-center justify-center gap-2 min-w-full min-h-80 border-dashed relative transition-all duration-200"
                        onDragOver={handleDragOver}
                        onDrop={handleOnDrop}
                        onDragLeave={()=>setIsDragOver(false)}
                    >
                        {previewURL ? (
                            <>
                                <img
                                    src={previewURL}
                                    alt="Preview"
                                    className="w-full max-h-80 object-cover"
                                />
                                <div
                                    onClick={() => {
                                        URL.revokeObjectURL(previewURL);
                                        setPreviewURL(null);
                                        setImage(null);
                                    }}
                                    className=" rounded-full bg-gray-300 h-8 w-8 md:h-12 md:w-12 flex items-center justify-center absolute top-4 right-4 cursor-pointer"
                                >
                                    <RxCross1 className="md:h-6 md:w-6" />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="rounded-full bg-gray-300 h-12 w-12 flex items-center justify-center">
                                    <FaPlus className="h-8 w-8" />
                                </div>
                                <span className="font-semibold">Add Image</span>
                                <span className="text-gray-500 dark:text-gray-200">
                                    Drag and drop or click to browse
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                {/* buttons */}
                <div className="flex justify-between min-w-full px-2">
                    <button
                        type="button"
                        onClick={handlePostDiscard}
                        disabled={isLoading}
                        className="px-4 py-2 font-semibold bg-neutral-600 dark:bg-neutral-300 dark:text-gray-800 text-white rounded-xl"
                    >
                        Discard
                    </button>
                    <button
                        type="button"
                        onClick={handlePostUpload}
                        disabled={(!image && !description.trim()) || isLoading}
                        className="px-7 py-2 font-semibold bg-indigo-600 text-white rounded-xl"
                    >
                        {isLoading ? "Uploading..." : "Post"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PostPage;
