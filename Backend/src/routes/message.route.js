import { Router } from "express";
import { getOrCreateConversation, getAllConversations, getMessages} from "../controllers/conversation.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();


router.use(verifyJwt);

router.post("/:id",getOrCreateConversation);
router.get("/",getAllConversations);
router.get("/:id",getMessages);



export default router;