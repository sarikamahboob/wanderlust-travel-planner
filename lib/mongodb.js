import mongoose from "mongoose";

export async function connectDB() {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected Successfully");
        return connection;
    } catch (error) {
        console.log(error);
    }
}