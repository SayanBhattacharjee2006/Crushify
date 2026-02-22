import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
function AuthLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

export default AuthLayout;
