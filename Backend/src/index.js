import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import passport from "passport"
// import "./config/passport.js"
import {createServer} from "http"
import { initSocket } from "./config/socket.js"

//routes imports
import authRouter from "./routes/auth.route.js"
import followRouter from "./routes/follow.route.js"
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import conversationRouter from "./routes/message.route.js"

const app = express();
const httpServer = createServer(app);
// Why we need httpServer?
// - For socket.io, we need httpServer, not app because app is not a httpServer.Socket server is build wrapped around httpServer

initSocket(httpServer);

//middlewares
app.use(passport.initialize());
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//routes 
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/users",followRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/conversations",conversationRouter);

app.get("/",(req,res)=>{
    res.send("I am running")
})

export default httpServer;