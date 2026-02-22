import React from "react";

function getPassStrength(password) {
    let score = 0;
    let hasUpper = false,
        hasNumber = false,
        hasLower = false,
        hasSpecial = false;
    for (let i = 0; i < password.length; i++) {
        const code = password.charCodeAt(i);

        if (code >= 65 && code <= 90) hasUpper = true;
        else if (code >= 97 && code <= 122) hasLower = true;
        else if (code >= 48 && code <= 57) hasNumber = true;
        else hasSpecial = true;
    }

    if (password.length >= 6) score++;
    if (hasUpper && hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    return score; // 0 to 4
}

export default function PasswordStrengthMeter({ password }) {
    const strength = getPassStrength(password);
    const percent = (strength / 4) * 100;

    const color =
        strength <= 1
            ? "bg-red-500"
            : strength <= 2
              ? "bg-orange-500"
              : strength <= 3
                ? "bg-yellow-500"
                : "bg-green-500";

    const label =
        strength <= 1
            ? "week"
            : strength <= 2
              ? "fair"
              : strength <= 3
                ? "Good"
                : "Strong";
    return (
        <div className="space-y-1">
            <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                <div
                    className={`h-full ${color} transition-all duration-300`}
                    style={{ width: `${percent}%` }}
                />
            </div>
            <span className="text-sm text-gray-600">
                Strength: <strong>{label}</strong>
            </span>
        </div>
    );
}
