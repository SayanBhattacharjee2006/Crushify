import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { deleteAvatar, setAvatar, completeProfile, updateProfile, getUserDetails, getAllLikedPosts, getAllPostsByUserId} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.post("/avatar",upload.single("avatar"),setAvatar);
router.delete("/avatar",deleteAvatar);
router.post("/complete-profile",completeProfile);
router.patch("/complete-profile",updateProfile);
router.get("/liked-posts",getAllLikedPosts);
router.get("/:id",getUserDetails);
router.get("/:id/posts",getAllPostsByUserId);

export default router;