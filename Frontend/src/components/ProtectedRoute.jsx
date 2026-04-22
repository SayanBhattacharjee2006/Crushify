import { Navigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"

function ProtectedRoute({children}){
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    if(isCheckingAuth)return <p>Loading.......</p>
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
