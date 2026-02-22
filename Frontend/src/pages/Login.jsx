import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../stores/auth.store";
import { useState, useEffect } from "react";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login, isLoading, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/app/add-profile-picture", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("All fields are required");
            return;
        }

        if (password.length < 6) {
            setError("Password must be 6 character long");
            return;
        }

        const res = await login(email, password);
        if (!res.success) setError(res.error);
    };

    const handleGoogleLogin = () => {
        // Redirect to backend Google OAuth endpoint
        window.location.href = "/api/v1/auth/google";
    };

    const handleGithubLogin = () => {
        window.location.href = "/api/v1/auth/github";
    };
    
    return (
        <div className="flex justify-center items-center  min-h-screen flex-col space-y-10 bg-[#F9FAFB] dark:bg-gray-800 dark:text-white">
            {/* heading section */}
            <span className="font-bold text-3xl">Sign in to your account</span>

            {/* form section */}
            <div className="max-w-80 sm:min-w-100 mx-auto py-10 shadow-xl px-12 bg-white rounded-2xl dark:bg-gray-700 dark:text-white">
                <form className="space-y-5 ">
                    {error && <div className="text-red-500">{error}</div>}
                    {/* email input */}
                    <Input
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={"Enter your email here..."}
                        disabled={isLoading}
                    />

                    {/* password input */}
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder={"******"}
                        disabled={isLoading}
                    />

                    {
                        password.length>0 && <PasswordStrengthMeter password={password}/>
                    }

                    {/* forgot password section */}
                    <div className="flex flex-col gap-2 sm:flex-row justify-between">
                        {/* Remember me  */}
                        <div>
                            <label htmlFor="">
                                <input type="checkbox" name="" id="" />
                                <span className="dark:text-gray-200">
                                    {" "}
                                    Remember me
                                </span>
                            </label>
                        </div>
                        {/* forgot */}
                        <div className="text-[#4F39F6]">
                            <Link to="forgot-password">Forgot password?</Link>
                        </div>
                    </div>

                    {/* sign in button */}
                    <button
                        className="bg-[#4F39F6] w-full py-1 text-white rounded-md"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        Sign in
                    </button>

                    <div className="flex w-full items-center gap-3 my-6">
                        <div className="flex-1 border-t border-gray-400" />
                        <span className=" text-gray-800 whitespace-nowrap dark:text-gray-300">
                            Or continue with
                        </span>
                        <div className="flex-1 border-t border-gray-400" />
                    </div>

                    {/* OAuth section */}
                    <div className="w-full flex  justify-evenly gap-4 sm:gap:0">
                        <button
                            type="button"
                            className=" border border-neutral-400 rounded-md sm:px-7 py-2 flex items-center gap-2 px-3"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <FaGoogle size={20} />
                            Google
                        </button>
                        <button 
                            type="button"
                            className=" border border-neutral-400 rounded-md sm:px-7 py-2 flex items-center gap-2 px-3"
                            onClick={handleGithubLogin}
                            disabled={isLoading}
                            >
                            <FaGithub size={20} />
                            Github
                        </button>
                    </div>
                </form>
            </div>

            {/* registration navigation */}
            <div className="text-neutral-800 dark:text-gray-300">
                Not a member?{" "}
                <Link to="/register" className="text-[#4F39F6] font-semibold">
                    Create new account
                </Link>
            </div>
        </div>
    );
}

export default Login;
