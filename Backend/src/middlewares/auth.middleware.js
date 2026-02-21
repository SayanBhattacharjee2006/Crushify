import jwt from "jsonwebtoken"
import mongoose from "mongoose";
export const verifyJwt = async (req,res,next) => {
    try {
        let token;
        // console.log(req.headers);
        // console.log(req.cookies);
        if(req.cookies && req.cookies.token){
            token = req.cookies.token;
        }else if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
            token = req.headers.authorization.split(" ")[1];
        }else{
            return res.status(401).json({message:"Access denied , unauthorized "})
        }
        // console.log(token)
        const payload =  jwt.verify(token,process.env.JWT_SECRET);
        // console.log(payload);
        req.user = {
            _id:new mongoose.Types.ObjectId(payload.userId)
        }
        
        // console.log(req.user);
        next();
    } catch (error) {
        console.log("Token verification error:",error?.message)
        return res.status(401).json({error:error?.message,message:"Error at token verification"})
    }
}

