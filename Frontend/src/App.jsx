import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/auth.store.js";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";
import AddProfilePicture from "./pages/AddProfilePicture.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PostPage from "./pages/PostPage.jsx";

function App() {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        const token = localStorage.getItem("token");
        // console.log("token:", token);
        if (token) {
            checkAuth();
        }
    }, [checkAuth]);

    return (
        <Routes>
            <Route path="/" element={<AuthLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route
                path="/add-profile-picture"
                element={<Navigate to="/app/add-profile-picture" replace />}
            />
            <Route
                path="/complete-profile"
                element={<Navigate to="/app/complete-profile" replace />}
            />

            <Route path="/app" element={<AppLayout />}>
                <Route
                    path="add-profile-picture"
                    element={<AddProfilePicture />}
                />
                <Route
                    path="complete-profile"
                    element={<CompleteProfile />}
                />
                <Route
                    path="home"
                    element={<HomePage/>}
                />
                <Route
                    path="post"
                    element={<PostPage/>}
                />
                <Route
                    path="profile/:id"
                    element={<ProfilePage/>}
                />
            </Route>
        </Routes>
    );
}

export default App;
