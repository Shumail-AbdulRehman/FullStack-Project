import { createClient } from "redis";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDb from "./db/db.js";
import { Subscription } from './models/subscriber.model.js';
import { Notification } from "./models/notifcation.model.js";

dotenv.config({ path: "./.env" });

connectDb();


const redisClient = createClient({
  socket: {
    host: 'my-redis',
    port: 6379
  }
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
await redisClient.connect();

async function processJob(job) {
  const { channelId,videoId, videoTitle } = JSON.parse(job);
  console.log("data from queue is :::",channelId,videoId,videoTitle)
//   const subscribers = await Subscription.find({ subscribedChannels: channelId }, "_id");

const subscribers=await Subscription.find({
    channel:channelId
});


console.log("subscribers are:::",subscribers)

if(subscribers.length==0) return ;

// const videoId=undefined
 const notifications = subscribers.map((sub) => ({
    user: sub.subscriber,
    video: videoId,
  }));

  await Notification.insertMany(notifications,{ordered:false})


  console.log("notifcation created for users");



//   subscribers.forEach((sub) => {
//     sendNotification(sub._id.toString(), {
//       type: "NEW_VIDEO",
//       channelId,
//       videoId,
//       videoTitle,
//     });
//   });
}

async function startWorker() {
  console.log("Worker started, waiting for jobs...");

  while (true) {
    try {
      const job = await redisClient.brPop("videoQueue", 0);
      if (job) await processJob(job.element);
    } catch (err) {
      console.error("Worker error:", err);
    }
  }
}

startWorker();
