
import api from "../library/api.js"

export const authServices = {
    register: async (fullname, email, password) => {
        const response = await api.post("/auth/register",{fullname, email, password})
        if(response.data.token){
            localStorage.setItem("token",response.data.token)
        }
        return response.data;
    },
    login: async (email, password) => {
        const response = await api.post("/auth/login",{email,password})
        if(response.data.token){
            localStorage.setItem("token", response.data.token)
        }
        return response.data;
    },
    logout: async () => {
        const response  = await api.post("/auth/logout")
        localStorage.removeItem("token")
        return response.data
    },
    getCurrentUser: async () => {
        const response  = await api.get("/auth/me")
        return response.data;
    },
    getAllFollowing:async (id) => {
        const response = await api.get(`/users/${id}/following`);
        return response.data;
    },
    getAllFollowers:(id) => {
        const response = api.get(`/users/${id}/followers`);
        return response.data
    }
} 