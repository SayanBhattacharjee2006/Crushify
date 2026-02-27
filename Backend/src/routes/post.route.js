import express from "express"
import {
    createPost,
    deletePost,
    getPostDetails,
    getFeed,
    getAllComments,
    getAllReplies
} from "../controllers/post.controller.js"
import {
    createComment,
    deleteComment,
} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { likeComment, likePost, unLikeComment, unLikePost } from "../controllers/like.controller.js";

const router = express.Router();

router.use(verifyJwt);

router.post("/",upload.single("postImage"),createPost);
router.get("/feed",getFeed)
router.delete("/:postId",deletePost);
router.get("/:postId",getPostDetails);
router.post("/:postId/like",likePost)
router.delete("/:postId/like",unLikePost)
router.post("/:postId/comments",createComment)
router.get("/:postId/comments",getAllComments)
router.delete("/:postId/comments/:commentId",deleteComment)
router.post("/:postId/comments/:commentId/like",likeComment)
router.delete("/:postId/comments/:commentId/like",unLikeComment)
router.get("/:postId/comments/:commentId/replies",getAllReplies)

export default router;

