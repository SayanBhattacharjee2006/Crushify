import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";

function CompleteProfile() {
    const [error, setError] = useState("");
    const [formdata, setformdata] = useState({
        username:"",
        bio:"",
        pronouns:"",
        phoneNumber:"",
        gender:"",
        age:"",
    });

    const {  isLoading, completeProfile } = useAuthStore();
    const navigate = useNavigate();

    const handleFormDataChange = (e) => {
        setformdata({
            ...formdata,
            [e.target.name]:e.target.value
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("REACHED SUBMIT HANDLER");
        // console.log("FORMDATA:", formdata);
        const res = await completeProfile(formdata);

        if (!res.success) {
            setError(res.error);
        }

        if (res.success) {
            setError("");
            navigate("/app/home");
        }

    }


    return (
        <div className="flex flex-col sm:flex-row w-full mt-10  dark:bg-gray-800 rounded-2xl gap-10 shadow-2xl text-gray-600">
            {/* left part */}
            <div className="flex flex-col gap-5 bg-indigo-600 text-white rounded-lg p-8 min-h-70 sm:max-w-70 justify-center">
                <span className="text-4xl font-bold">
                    Complete your profile
                </span>
                <span className="text-lg text-gray-300">
                    Help us personalize your experience Uby providing a few more
                    details about yourself
                </span>
            </div>

            {/* right form part */}
            <div className="p-10 flex items-center justify-center min-w-100 sm:min-w-0">
                <form action="" className="flex flex-col gap-5">
                    {
                        error && <span className="text-red-600">{error}</span>
                    }
                    <div className="flex flex-col gap-5 min-w-70">
                    <Input label={"Username:"} value={formdata.username} name={"username"} placeholder={"john doe"} onChange={handleFormDataChange} />

                        <div className="flex gap-5 items-center">
                            <label
                                htmlFor="pronouns"
                                className="text-black dark:text-gray-300"
                            >
                                Pronouns:
                            </label>
                            <select
                                name="pronouns"
                                id="pronouns"
                                value={formdata.pronouns}
                                className="border border-gray-300
                                text-gray-600 
                                dark:text-gray-300
                                dark:bg-gray-600 rounded-lg p-1"
                                onChange={handleFormDataChange}
                            >
                                <option disabled >select pronouns</option>
                                <option value="he/him">He/Him</option>
                                <option value="she/her">She/Her</option>
                                <option value="they/them">They/Them</option>
                                <option value="ze/zir">Ze/Zir</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <Input label={"Age"} name={"age"} value={formdata.age} type={"number"} onChange={handleFormDataChange}/>

                        <Input
                            label={"Phone No."}
                            name={"phoneNumber"}
                            type={"tel"}
                            value={formdata.phoneNumber}
                            placeholder={"+1 (555) 000-0000"}
                            onChange={handleFormDataChange}
                        />

                        <div className="flex gap-5 items-center">
                            <label
                                htmlFor="gender"
                                className="text-black dark:text-gray-300"
                            >
                                Gender
                            </label>
                            <select
                                name="gender"
                                id="gender"
                                value={formdata.gender}
                                className="dark:bg-gray-600 rounded-lg p-1 border text-gray-600 dark:text-gray-300 border-gray-300"
                                onChange={handleFormDataChange}
                            >
                                <option disabled >select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">other</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-5">
                            <label
                                htmlFor="bio"
                                className="text-black dark:text-gray-300"
                            >
                                Bio:
                            </label>
                            <textarea
                                name="bio"
                                id="bio"
                                value={formdata.bio}
                                onChange={handleFormDataChange}
                                placeholder="Tell us about yourself..."
                                className="bg-gray-50 rounded-lg p-1 
                                border border-gray-300 focus:outline-none dark:bg-gray-600 min-w-60"
                            ></textarea>
                        </div>
                    </div>
                    <div className="p-2 flex justify-between">
                        <Link
                            to={"/app/home"}
                            className=" dark:bg-gray-600 dark:text-white rounded-lg font-semibold  hover:bg-gray-300 
                            dark:hover:bg-gray-700 transition-colors duration-300 py-2 px-3"
                        >
                            {isLoading ? "skipping":"skip for now"}
                        </Link>

                        <button
                            type="submit"
                            disabled={isLoading}
                            onClick={handleSubmit}
                            className="py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors duration-300"
                        >
                            {isLoading ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CompleteProfile;
