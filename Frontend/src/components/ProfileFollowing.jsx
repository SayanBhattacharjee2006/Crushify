import React from "react";
import { useAuthStore } from "../stores/auth.store";
import { useParams } from "react-router-dom";
import UserListCard from "./UserListCard.jsx";
import { AnimatePresence, motion } from "motion/react";
function ProfileFollowing() {
    const [allFollowing, setAllFollowing] = React.useState([]);
    const [isloadingFollowing, setIsloadingFollowing] = React.useState(true);
    const { getAllFollowing } = useAuthStore();
    const { id } = useParams();

    const containerVariant = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                delayChildren: 0.5,
                staggerChildren: 0.5,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                delayChildren: 0.5,
                staggerChildren: 0.5,
            },
        },
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };


    React.useEffect(() => {
        const fetchAllFollowing = async () => {
            if (!id) return;
            setIsloadingFollowing(true);
            const res = await getAllFollowing(id);
            console.log(res);
            setAllFollowing(res.following);
            setIsloadingFollowing(false);
        };

        fetchAllFollowing();
    }, [id]);

    return (
    <AnimatePresence>
    <motion.div className="w-full flex flex-col gap-4" variants={containerVariant} initial="hidden" animate="show" exit="exit">
            {allFollowing.length !== 0 &&
                !isloadingFollowing &&
                allFollowing.map((followingUser) => (
                    <motion.div key={followingUser._id} variants={itemVariant}>

                    <UserListCard key={followingUser._id} user={followingUser} />
                    </motion.div>
                ))}
            <div className="h-10 transparent"></div>
        </motion.div>
    </AnimatePresence>
    );
}

export default ProfileFollowing;
