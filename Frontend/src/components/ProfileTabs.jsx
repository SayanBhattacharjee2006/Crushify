import React from "react";
import {  NavLink, useParams } from "react-router-dom";

function ProfileTabs() {
    const { id } = useParams();

    const options = [
        {
            name: "Posts",
            path: `/app/profile/${id}`,
            end: true,
        },
        {
            name: "Followers",
            path: `/app/profile/${id}/followers`,
            end: false,
        },
        {
            name: "Following",
            path: `/app/profile/${id}/following`,
            end: false,
        },
    ];
    return (
        <div className="flex gap-2 w-full  justify-evenly p-1">
            {options.map((option) => (
                <NavLink
                    key={option.name}
                    to={option.path}
                    end={option.end}
                    className={({ isActive }) =>
                        `p-1 w-full rounded-2xl text-lg font-semibold flex justify-center items-center ${isActive? "bg-indigo-500 text-white shadow-lg": "sm:bg-zinc-100 dark:bg-gray-600"}`
                    }
                >
                    {option.name}
                </NavLink>
            ))}
        </div>
    );
}

export default ProfileTabs;
