import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

function OAuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const checkAuth = useAuthStore((state) => state.checkAuth);

    useEffect(() => {
        (async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get("token");

            if (token) {
                localStorage.setItem("token", token);
            }

            await checkAuth();
            setTimeout(() => {
                navigate("/app/add-profile-picture", { replace: true });
            }, 0);
        })();
    }, [checkAuth, location.search, navigate]);

    return <p>Signing you in...</p>;
}

export default OAuthCallback;
