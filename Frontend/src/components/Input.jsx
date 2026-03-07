import React, { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

function Input({
    label,
    type,
    value,
    name,
    onChange,
    placeholder,
    required,
    className,
    ...props
}) {
    const isPassword = type === "password";
    const [showPass, setShowPass] = useState(false);
    return (
        <div className="flex flex-col gap-2">
            <label className="space-y-2">
                {label && (
                    <span className="inline-block w-full text-neutral-800 dark:text-gray-300">
                        {label}
                    </span>
                )}
            </label>

            <div className="relative">
                <input
                    type={isPassword && showPass ? "text" : type}
                    name={name || ""}
                    id=""
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    {...props}
                    className={`border  border-neutral-400 min-h-8 rounded-sm w-full px-2 ${className}`}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPass((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 dark:text-neutral-300 text-gray-600"
                    >
                        {showPass ? <FaEyeSlash /> : <IoEyeSharp />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Input;
