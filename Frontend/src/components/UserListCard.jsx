import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
function UserListCard({ user }) {
    console.log("user",user);
    const navigate = useNavigate()
    return (
        <motion.div className="flex gap-2 p-2 rounded-2xl bg-zinc-200 dark:bg-gray-600">
            {/* avatar */}
            <motion.div
                     
                     onClick={()=>navigate(`/app/profile/${user._id}`)}
                     className="rounded-full w-10 h-10 overflow-hidden object-cover ring-1 ring-gray-200"
                    >
                        <motion.img
                            src={user.avatarURL}
                            alt="post uploader profile pic"
                            className="w-full h-full"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            loading="lazy"
                        />
                    </motion.div>
            {/* Details */}
            <motion.div className="flex flex-col ">
                <span className="text-lg font-semibold leading-4">{user.fullname}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">{user.username}</span>
            </motion.div>
        </motion.div>
    );
}

export default React.memo(UserListCard);
