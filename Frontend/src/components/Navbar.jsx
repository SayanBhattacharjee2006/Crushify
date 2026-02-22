import { useEffect, useState } from "react";
import { FaRegMoon } from "react-icons/fa";
import { GiLion } from "react-icons/gi";
import { IoMdSunny } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { CgProfile } from "react-icons/cg";


function Navbar() {
    const [theme, setTheme] = useState("light");
    const { isAuthenticated, logout, user} = useAuthStore();
    const navigate = useNavigate();
    const profileId = user?._id || user?.id;

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");

        console.log(root.classList.contains("dark"));
    }, [theme]);

    const handleDark = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    const handleLogout = () => {
        logout();
        navigate("/login")
    }

    return (
        <div className=" shadow-xl w-full dark:bg-gray-700 dark:text-white">
            <div className="max-h-15 flex max-w-200 mx-auto justify-between items-center p-3">
                {/* logo part */}
                <NavLink to="/app/home">
                    <div className=" flex gap-2 text-2xl items-center">
                        <GiLion size={40} />
                        <span>CruSify</span>
                    </div>
                </NavLink>
                {/* menu section */}
                <div className="px-3 md:px-0 flex gap-5 sm:gap-8 items-center">
                    <div className="flex gap-3 sm:gap-5">
                        <NavLink to="/app/home">
                            <span className="text-xl hover:text-[#4F39F6] dark:hover:text-[#4F39F6]">
                                Home
                            </span>
                        </NavLink>

                        <NavLink to="/app/features">
                            <span className="text-xl hover:text-[#4F39F6] dark:hover:text-[#4F39F6]">
                                Post
                            </span>
                        </NavLink>
                        {isAuthenticated && <button onClick={handleLogout} >
                            <span className="text-xl dark:hover:text-[#4F39F6]">
                                logout
                            </span>
                        </button>}
                    </div>
                    {
                        isAuthenticated && 
                        <NavLink to={`/app/profile/${profileId}`}>
                            <span className="text-xl hover:text-[#4F39F6] dark:hover:text-[#4F39F6]">
                                <CgProfile size={25} />
                            </span>
                        </NavLink>
                    }
                    <button onClick={handleDark}>
                        {theme === "dark" ? (
                            <FaRegMoon size={25} />
                        ) : (
                            <IoMdSunny size={25} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
