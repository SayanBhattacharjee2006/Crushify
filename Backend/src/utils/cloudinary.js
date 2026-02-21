import dotenv from "dotenv";
dotenv.config();

import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadImage = async (filePath) => {
    try {
        const response = await cloudinary.uploader.upload(filePath,{
            resource_type:"image",
        })

        fs.unlinkSync(filePath);
        return response;
    } catch (error) {
        console.log("CLOUDINARY UPLOAD ERROR:",error?.message);
        fs.unlinkSync(filePath);
        return null;
    }
}

export default uploadImage
