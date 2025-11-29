import mongoose from "mongoose";
import { DB_NAME } from "../utils/constant.js";

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}`
        );
        console.log("MONGODB CONNECTED");
    } catch (error) {
        console.log("DB ERROR:", error);
    }
};

export default connectDb;
