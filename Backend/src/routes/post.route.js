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

router.post("/",upload.single("postImage"),createPost); //frontend done
router.get("/feed",getFeed) // frontend done
router.delete("/:postId",deletePost);
router.get("/:postId",getPostDetails); // frontend done
router.post("/:postId/like",likePost) // frontend done
router.delete("/:postId/like",unLikePost) // frontend done
router.post("/:postId/comments",createComment) // frontend done
router.get("/:postId/comments",getAllComments)// fromend done
router.delete("/:postId/comments/:commentId",deleteComment)
router.post("/:postId/comments/:commentId/like",likeComment)
router.delete("/:postId/comments/:commentId/like",unLikeComment)
router.get("/comments/:commentId/replies",getAllReplies)

export default router;

