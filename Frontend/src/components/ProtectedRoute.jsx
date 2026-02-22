import { Navigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"

function ProtectedRoute({children}){
    const { isAuthenticated, isLoading} = useAuthStore();

    if(isLoading)return <p>Loading.......</p>
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;