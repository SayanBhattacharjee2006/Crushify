import multer from "multer"
import path from "path"

const storage = multer.diskStorage({

    destination:function(req,file,cb){
        cb(null,"uploads")
    },
    filename:function(req,file,cb){
        const extension = path.extname(file.originalname);
        cb(null,`avatar${req.user._id}${Date.now()}${extension}`)
    }
})

export const upload = multer({storage})