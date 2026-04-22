import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../stores/auth.store";
import { useNavigate } from "react-router-dom";
import useSocketListener from "../hooks/UseSocketListener.jsx";
function AppLayout() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
    const navigate = useNavigate();
    useSocketListener();
    useEffect(() => {
        if (isCheckingAuth) return;

        const token = localStorage.getItem("token");
        // Avoid redirecting before checkAuth completes when a token exists.
        if (!isAuthenticated && !token) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, isCheckingAuth, navigate]);

    return (
        <>
            <Navbar />
            <div className="dark:bg-gray-900 dark:text-white min-h-screen">
                <div className="min-h-full max-w-full sm:max-w-200 bg-n mx-auto p-2 ">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default AppLayout;
