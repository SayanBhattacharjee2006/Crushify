import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import passport from "passport"
// import "./config/passport.js"


//routes imports
import authRouter from "./routes/auth.route.js"
import followRouter from "./routes/follow.route.js"
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"


const app = express();

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


app.get("/",(req,res)=>{
    res.send("I am running")
})

export default app;