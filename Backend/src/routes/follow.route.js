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

router.post("/:id/follow",followUser);// frontend done
router.delete("/:id/follow",unFollowUser);// frontend done
router.get("/:id/follow/status",getFollowStatus);// frontend done
router.get("/:id/followers",getAllFollowers);
router.get("/:id/following",getAllFollowing);

export default router;