import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { deleteAvatar, setAvatar, completeProfile, updateProfile, getUserDetails, getAllLikedPosts, getAllPostsByUserId} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.post("/avatar",upload.single("avatar"),setAvatar); // frontend done
router.delete("/avatar",deleteAvatar);
router.post("/complete-profile",completeProfile); // frontend done
router.patch("/complete-profile",updateProfile);
router.get("/liked-posts",getAllLikedPosts);
router.get("/:id",getUserDetails); // frontend done
router.get("/:id/posts",getAllPostsByUserId);

export default router;