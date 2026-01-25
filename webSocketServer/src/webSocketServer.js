import WebSocket, { WebSocketServer } from "ws";
import { createClient } from "redis";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import "dotenv/config";

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket server running on port 8080");

const redisClient = createClient();
await redisClient.connect();

const onlineUsers = new Map();

wss.on("connection", (ws, req) => {

  const rawCookie = req?.headers?.cookie || "";
  const parsedCookie = cookie.parse(rawCookie);

  if (!parsedCookie.accessToken) {
      console.log("Connection rejected: No access token");
      ws.close(1008, "Authentication required");
      return;
  }

  let decodedInfo;
  try {
      decodedInfo = jwt.verify(parsedCookie.accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
      console.log("Token verification failed:", error.message);
      ws.close(1008, "Invalid Token");
      return;
  }

  const userId = decodedInfo._id;
  onlineUsers.set(userId, ws);
  console.log("User connected securely:", userId);


  ws.on("close", () => {
    onlineUsers.delete(userId); 
    console.log("User disconnected:", userId);
  });
});

const sendNotification = (data) => {
  // console.log("data is:::", data);
  
  if (!data.subscribersList) return;

  data.subscribersList.forEach((sub) => {  
    const ws = onlineUsers.get(sub.subscriber.toString());  
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      const notificationData = {
        video: { ...data.video, owner: data.user }
      };
      
      ws.send(JSON.stringify(notificationData));
      console.log("Notification sent to:", sub.subscriber);
    }
  });
};

async function startRedisWorker() {
  console.log("Redis Worker started...");
  while (true) {
    try {
      const job = await redisClient.brPop("liveNotificationQueue", 0);
      if (job) {
        const data = JSON.parse(job.element);
        sendNotification(data);
      }
    } catch (err) {
      console.error("Worker error:", err);
      await new Promise(resolve => setTimeout(resolve, 5000)); 
    }
  }
}

startRedisWorker();


process.on('SIGINT', async () => {
    console.log("Shutting down...");

    wss.close();

    try {
        if (redisClient.isOpen) {
            await redisClient.quit();
        }
    } catch (err) {
        console.log("Redis connection closed forcibly");
    }

    process.exit(0);
});