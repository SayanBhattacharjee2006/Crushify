import mongoose from "mongoose"
export const connectDB = async () => {
    try {
        const connectionResponse = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Running on host:",connectionResponse.connection.host)
    } catch (error) {
        console.log("mongodb connection error",error.message)
        process.exit(1);
    }
}