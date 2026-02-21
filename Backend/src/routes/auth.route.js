import { Router } from "express";
import jwt from "jsonwebtoken";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    googleOAuthCallback,
    githubOAuthCallback
} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJwt, logoutUser);
router.get("/me", verifyJwt, getCurrentUser);

//google oAuth routes

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }), googleOAuthCallback,
);

router.get("/github",passport.authenticate("github",{scope:["user:email"]}));

router.get("/github/callback",
    passport.authenticate("github", { session: false }),
    githubOAuthCallback
)

export default router;
