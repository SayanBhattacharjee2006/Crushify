import mongoose from "mongoose";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
const generateToken = function (userId) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    return token;
};

const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
};

const registerUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "All creadentials required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User already registered. Try login" });
        }

        const newUser = await User.create({
            fullname,
            email,
            password,
            provider: "local",
        });

        if (!newUser) {
            return res
                .status(500)
                .json({ message: "Error occured at creating new user" });
        }

        const token = generateToken(newUser._id);

        return res
            .status(201)
            .cookie("token", token, cookieOptions)
            .json({
                message: "User successfully registered",
                token,
                user: {
                    _id: newUser._id,
                    id: newUser._id,
                    fullname: newUser.fullname,
                    email: newUser.email,
                    provider: newUser.provider,
                    avatarURL: newUser.avatarURL,
                },
            });
    } catch (error) {
        console.log("Error at user registration:", error?.message);
        return res.status(500).json({
            error: error?.message,
            message: "Error occured at user registration",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All creadentials required",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password 1",
            });
        }

        if (user.provider === "google") {
            return res.status(400).json({
                message: "Use Google login for this account",
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password 2",
            });
        }

        const token = generateToken(user._id);

        return res
            .status(200)
            .cookie("token", token, cookieOptions)
            .json({
                message: "User successfully logged In",
                token,
                user: {
                    _id: user._id,
                    id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    provider: user.provider,
                    avatarURL: user.avatarURL,
                },
            });
    } catch (error) {
        console.log("Error at user login:", error?.message);
        return res.status(500).json({
            error: error?.message,
            message: "Error occured at user login",
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        return res
            .status(200)
            .clearCookie("token", cookieOptions)
            .json({ mesasge: "user logged out successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error at user logout", error: error?.mesasge });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user._id;;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        return res.status(200).json({
            message: "User data retreived successfully",
            user,
        });
    } catch (error) {
        console.log("User data retreival error: ", error?.mesasge);
        return res.status(200).json({
            message: "User data retreived successfully",
            error: error?.message,
        });
    }
};

const googleOAuthCallback = async (req, res) => {
    try {
        const user = req.user;
        const token = generateToken(user._id);
        return res
            .status(200)
            .cookie("token", token, cookieOptions)
            .redirect(
                `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/callback?token=${token}`,
            );
    } catch (error) {
        console.log("Google OAuth Callback Error: ", error?.message);
        return res.status(500).json({
            message: "Error during Google OAuth callback",
            error: error?.message,
        });
    }
};

const githubOAuthCallback = async (req,res) => {
    try {
        const token = generateToken(req.user._id);
        return res
            .status(200)
            .cookie("token", token, cookieOptions)
            .redirect(
                `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/callback?token=${token}`,
            );
    } catch (error) {
        console.log("Github OAuth Callback Error: ", error?.message);
        return res.status(500).json({
            message: "Error during Github OAuth callback",
            error: error?.message,
        })
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    googleOAuthCallback,
    githubOAuthCallback
};
