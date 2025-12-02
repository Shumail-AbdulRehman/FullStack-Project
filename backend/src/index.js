import dotenv from "dotenv";
import connectDb from "./db/index.js";
import app from "./app.js";
import { createClient } from "redis";
import { Video } from "./models/video.model.js";

export const client=createClient();

dotenv.config({
    path: "./.env",
});
connectDb()
    .then(() => {
        client.connect();
        // Video.syncIndexes();
        // console.log("indexes synced")
        console.log("redis client is running on default port")
        app.listen(process.env.PORT, () => {
            console.log("Server is running on Port", process.env.PORT);
        });
    })
    .catch((error) => {
        console.log("CONNECTION TO DB FAILED:=>", error);
    });
