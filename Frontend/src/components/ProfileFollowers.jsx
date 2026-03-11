import React, { useEffect } from "react";
import { useAuthStore } from "../stores/auth.store.js";
import { useParams } from "react-router-dom";
import UserListCard from "./UserListCard.jsx";
import { AnimatePresence, motion } from "motion/react";

function ProfileFollowers() {
    const [allfollowers, setAllFollowers] = React.useState([]);
    const [isLoadingFollowers, setIsLoadingFollowers] = React.useState(true);
    const { getAllFollowers } = useAuthStore();
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

    useEffect(() => {
        const fetchFollowers = async () => {
            const res = await getAllFollowers(id);
            setAllFollowers(res.followers);
            // console.log("FETCHED FOLLOWERS",followers);
            setIsLoadingFollowers(false);
        };

        if (id) {
            setIsLoadingFollowers(true);
            fetchFollowers();
        }
    }, [id]);

    return (
        <AnimatePresence>
            <motion.div className="w-full flex flex-col gap-4" variants={containerVariant} initial="hidden" animate="show" exit="exit">
                {allfollowers.length !== 0 &&
                    !isLoadingFollowers &&
                    allfollowers.map((follower) => (
                        <motion.div key={follower._id} variants={itemVariant}>
                            <UserListCard key={follower._id} user={follower} />
                        </motion.div>
                    ))}
                <div className="h-10 transparent"></div>
            </motion.div>
        </AnimatePresence>
    );
}

export default ProfileFollowers;
