import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { DEFAULT_AVATAR_URL } from "../../../Backend/src/constants/default_url";
import { FaPlus } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function AddProfilePicture() {
    const inputRef = useRef(null);
    const { user, isLoading, uploadProfilePicture, isAuthenticated } =
        useAuthStore();
    const [error, setError] = useState("");
    const [avatar, setAvatar] = useState(user?.avatarURL || DEFAULT_AVATAR_URL);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            navigate("/login");
        }
        if (
            isAuthenticated &&
            user?.avatarURL &&
            user?.avatarURL !== DEFAULT_AVATAR_URL
        ) {
            navigate("/app/complete-profile", { replace: true });
        }
    }, [isLoading, isAuthenticated, user, navigate]);

    useEffect(() => {
        setAvatar(user?.avatarURL || DEFAULT_AVATAR_URL);
    }, [user?.avatarURL]);

    const handleAvatarUpload = async (e) => {
        console.log("FILE SELECTED:", e.target.files);
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file");
            return;
        }

        if (file.size > 5 * 1025 * 1025) {
            alert("File size should be less than 5MB");
            return;
        }

        const avatar_temporary_url = URL.createObjectURL(file);
        setAvatar(avatar_temporary_url);

        const res = await uploadProfilePicture(file);

        URL.revokeObjectURL(avatar_temporary_url);

        if (!res.success) {
            alert("Error at uploading avatar");
            setError(res.error || "Error at uploading avatar");
            setAvatar(user?.avatarURL || DEFAULT_AVATAR_URL);
        }

        if (res.success && res.user?.avatarURL) {
            setAvatar(res.user.avatarURL);
            navigate("/app/complete-profile", { replace: true });
        }
    };

    return (
        <div className="flex justify-center items-center  flex-col py-8 gap-10 dark:text-white">
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
            />

            <div className="flex flex-col gap-2 items-center">
                <span className="text-4xl font-semibold">
                    Upload your profile picture
                </span>
                <span className="text-gray-500 ">
                    upload a profile picture so that others know who you are
                </span>
            </div>

            <div className="flex flex-col gap-10 items-center shadow-lg pt-20 pb-10 px-15 relative dark:bg-gray-700 rounded-xl">
                {/* rounded image upload section along with camera icon*/}
                <div className="relative h-50 w-50 shrink-0">
                    <div className="h-full w-full overflow-hidden rounded-full border-2 border-gray-300 flex justify-center items-center">
                        <img
                            src={avatar}
                            alt="avatar"
                            onClick={() =>
                                !isLoading && inputRef.current.click()
                            }
                            className="w-full h-full object-cover cursor-pointer"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => inputRef.current.click()}
                        disabled={isLoading}
                        className="absolute bottom-1 right-2 cursor-pointer bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-white shadow"
                    >
                        <FaCamera className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center text-center gap-2" >
                    <button
                        className="bg-blue-500 text-lg py-2 px-4 flex items-center gap-2 rounded-xl text-white"
                        disabled={isLoading}
                        onClick={() => inputRef.current.click()}
                    >
                        <FaPlus />
                        Add Image
                    </button>

                    <div className="flex justify-center w-full px-5 text-lg text-center ">
                        <Link
                            to="/app/complete-profile"
                            className={`text-gray-500 hover:text-gray-700 ${isLoading ? "pointer-events-none" : ""} dark:text-gray-400 dark:hover:text-gray-200 dark:bg-gray-700 py-2 px-5 rounded-lg`}
                        >
                            skip
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProfilePicture;
