import { create } from "zustand";
import { authServices } from "../services/auth.service";
import { userServices } from "../services/user.service";

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,

    register: async (fullname, email, password) => {
        try {
            set({ isLoading: true });
            const data = await authServices.register(fullname, email, password);
            set({
                isLoading: false,
                isAuthenticated: true,
                user: data.user,
            });
            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
            });
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Registration Failed ! Try Again | Sorry for the inconvenience",
            };
        }
    },
    login: async (email, password) => {
        try {
            set({ isLoading: true });
            const data = await authServices.login(email, password);
            set({
                isLoading: false,
                isAuthenticated: true,
                user: data.user,
            });
            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
            });
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Login Failed ! Try Again | Sorry for the inconvenience",
            };
        }
    },
    logout: async () => {
        try {
            set({ isLoading: true });
            const data = await authServices.logout();
            set({
                isLoading: false,
                isAuthenticated: false,
                user: null,
            });
            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
                isAuthenticated: false,
                user: null,
            });
            return {
                success: true, // evenif error occured logout the user manually
            };
        }
    },
    checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            set({
                isAuthenticated: false,
                user: null,
            });
            return;
        }

        try {
            set({ isLoading: true });
            const data = await authServices.getCurrentUser();
            set({
                isLoading: false,
                isAuthenticated: true,
                user: data.user,
            });
        } catch (error) {
            localStorage.removeItem("token"); // if any error occured during the fetching of user data from server then remove the cookie from localstorage
            set({ isLoading: false, isAuthenticated: false, user: null });
        }
    },
    uploadProfilePicture: async (file) => {
        try {
            set({ isLoading: true });
            const data = await userServices.uploadProfilePicture(file);

            if (!data?.success || !data?.user) {
                set({ isLoading: false });
                return {
                    success: false,
                    error:
                        data?.message ||
                        "Profile Picture Upload Failed ! Try Again | Sorry for the inconvenience",
                };
            }

            set({
                isLoading: false,
                user: data.user,
            });
            return {
                success: true,
                user: data.user,
            };
        } catch (error) {
            set({ isLoading: false });
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Profile Picture Upload Failed ! Try Again | Sorry for the inconvenience",
            };
        }
    },
    completeProfile: async (data) => {
        try {
            set({ isLoading: true });
            console.log("REACHED STORE");
            console.log("DATA AT STORE:", data);
            const res = await userServices.completeProfile(data);
            if (!res?.success || !res?.user) {
                set({ isLoading: false });
                return {
                    success: false,
                    error:
                        res?.message ||
                        "Profile Completion Failed ! Try Again | Sorry for the inconvenience",
                };
            }
            set({
                isLoading: false,
                user: res.user,
            });
            return {
                success: true,
                user: res.user,
            };
        } catch (error) {
            set({ isLoading: false });
            return {
                success: false,
                error:
                    error.response?.res?.message ||
                    "Profile Completion Failed ! Try Again | Sorry for the inconvenience",
            };
        }
    },
    getFollowStatus: async (id) => {
        try {
            set({ isLoading: true });
            const data = await userServices.getfollowStatus(id);
            set({ isLoading: false });
            return {
                success: true,
                followStatus: data?.data ?? false,
            };
        } catch (error) {
            set({ isLoading: false });
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Fetching follow status failed. Try again.",
            };
        }
    },
    getUserDetails: async (id) => {
        try {
            set({ isLoading: true });
            const res = await userServices.getUserDetails(id);
            set({ isLoading: false });
            return {
                success: true,
                user: res.user,
            };
        } catch (error) {
            set({ isLoading: false });
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Fetching user details failed. Try again.",
            };
        }
    },
    followUser: async (id) => {
        try {
            set({ isLoading: true });
            const res = await userServices.followUser(id);
            set({ isLoading: false});
            return {
                success: true,
                followStatus: res.success
            }
        } catch (error) {
            set({ isLoading: false });
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Following user failed. Try again.",
            };
        }
    },
    unfollowUser: async (id) => {
        try {
            set({ isLoading: true})
            const res = await userServices.unfollowUser(id);
            set({ isLoading: false})
            return {
                success: true,
                followStatus: res.success
            }
        } catch (error) {
            set({ isLoading: false });
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Unfollowing user failed. Try again.",
            };
        }
    }
}));
