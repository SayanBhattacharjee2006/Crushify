import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth.store.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useConversationStore } from "../stores/conversation.store.js";

function ProfileCard() {
    const { user, isLoading, getFollowStatus, getUserDetails, followUser, unfollowUser } = useAuthStore();
    const { id } = useParams();
    const [followStatus, setFollowStatus] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const loggedInUserId = user?._id || user?.id;
    const { openConversation } = useConversationStore();
    const navigate = useNavigate();


    useEffect(() => {
        if (!id || !user) return;

        getFollowStatus(id).then((res) => {
            if (res.success) {
                setFollowStatus(Boolean(res.followStatus));
            }
        });

        if (id === loggedInUserId) {
            setCurrentUser(user);
            return;
        }

        getUserDetails(id).then((res) => {
            if (res.success && res.user) {
                setCurrentUser(res.user);
                return;
            }
            setCurrentUser(null);
        });
    }, [id, user, loggedInUserId, getFollowStatus, getUserDetails, setFollowStatus, followStatus]);

    const handleUnfollow = async (e) => {
        e.preventDefault();
        const res = await unfollowUser(id);

        if (res.success) {
            setFollowStatus(false);
        }
    }

    const handleFollow = async (e) => {
        e.preventDefault();
    
        const res = await followUser(id);

        if (res.success) {
            setFollowStatus(true);
        }
    }

    const handleMessageUser = async () => {
        const convoId = await  openConversation(id);
        navigate(`/app/messages/${convoId}`);
    }


    return (
        <div className="flex flex-col md:flex-row p-5  gap-4 items-center md:items-start justify-evenly rounded-2xl">
            {/* Photo part */}
            <div className="flex flex-col items-center gap-3 p-5 min-h-63 min-w-60 sm:bg-zinc-100 rounded-2xl sm:shadow-xl dark:bg-gray-600">
                {/* image part */}
                <div className="h-40 w-40 overflow-hidden rounded-full border border-gray-500">
                    <img
                        src={currentUser?.avatarURL}
                        alt="profile picture"
                        className="h-full w-full object-cover"
                    />
                </div>
                {/* edit button */}
                {id === loggedInUserId ? (
                    <div>
                        <Link 
                        to="/app/edit-profile"
                        className="bg-indigo-600 text-white px-5 py-2 text-lg rounded-xl cursor-pointer"
                    >
                            Edit Profile
                        </Link>
                    </div>
                ) : followStatus ? (
                    <div>
                        <button
                             className="bg-indigo-600 text-white px-5 py-2 text-lg rounded-xl cursor-pointer"
                            onClick={handleUnfollow}
                        >
                            unfollow
                        </button>
                    </div>
                ) : (
                    <div>
                        <button 
                            onClick={handleFollow}
                            className="bg-indigo-600 text-white px-5 py-2 text-lg rounded-xl cursor-pointer"
                        >
                            Follow
                        </button>
                    </div>
                )}
            </div>

            {/* detailspart */}
            <div className="flex flex-col gap-2 min-w-110 p-3 justify-evenly min-h-63 bg-zinc-100 rounded-2xl shadow-xl dark:bg-gray-600">
                {/* Username fullname and follow button part */}
                <div className="flex justify-between">
                    {/* fullName and username div */}
                    <div className="flex flex-col">
                        <span className="text-2xl font-semibold">
                            {currentUser?.fullname}
                        </span>
                        <span className=" text-gray-500 dark:text-gray-200">
                            {currentUser?.username || "username"}
                        </span>
                    </div>
                    {/* Follow and unfollow button div */}
                    {id === loggedInUserId ? (
                        <div>
                            <Link 
                                to="/app/details"
                                className="bg-indigo-600 text-white px-5 py-2 text-lg rounded-xl cursor-pointer"
                            >
                                See Details
                            </Link>
                        </div>
                    ):(
                        <div>
                            <button 
                                onClick={handleMessageUser}
                                className="bg-indigo-600 text-white px-5 py-2 text-lg rounded-xl cursor-pointer"
                            >
                                Message
                            </button>
                        </div>
                    )}
                </div>
                {/* Bio part */}
                <div>
                    {currentUser?.bio ||
                        "Curious soul exploring ideas, building dreams with patience and courage, finding beauty in small moments, learning endlessly, growing with gratitude."}
                </div>

                <div className="h-0.5 bg-gray-300 dark:bg-gray-500"></div>

                {/* Followers cnt following and post */}
                <div className="flex justify-evenly">
                    {/* post count */}
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-lg text-gray-600 dark:text-gray-100">
                            840
                        </span>
                        <span>posts</span>
                    </div>
                    {/* follower count */}
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-lg text-gray-600 dark:text-gray-100">
                            {currentUser?.followersCount || 659}
                        </span>
                        <span>followers</span>
                    </div>
                    {/* following count */}
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-lg text-gray-600 dark:text-gray-100">
                            {currentUser?.followingCount || 549649}
                        </span>
                        <span>following</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;
