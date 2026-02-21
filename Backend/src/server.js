import dotenv from "dotenv"

dotenv.config()

import app from "./index.js"
import { connectDB } from "./config/db.js"
import "./config/passport.js"

const PORT = process.env.PORT || 5000;
console.log(process.env.MONGODB_URI)
connectDB();

app.listen(PORT,()=>{
    console.log(`Server is running in http://localhost:${PORT}`)
})
