import {Router} from "express";
import {
    followUser,
    unFollowUser,
    getFollowStatus,
    getAllFollowers,
    getAllFollowing
} from "../controllers/follow.controller.js"
const router = Router();

import { verifyJwt } from "../middlewares/auth.middleware.js";

router.use(verifyJwt);

router.post("/:id/follow",followUser);
router.delete("/:id/follow",unFollowUser);
router.get("/:id/follow/status",getFollowStatus);
router.get("/:id/followers",getAllFollowers);
router.get("/:id/following",getAllFollowing);

export default router;