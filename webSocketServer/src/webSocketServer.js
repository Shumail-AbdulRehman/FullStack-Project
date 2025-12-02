import WebSocket, { WebSocketServer } from "ws";
import { createClient } from "redis";

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket server running on port 8080");

const redisClient = createClient();
await redisClient.connect();

const onlineUsers = new Map();

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const { userId } = JSON.parse(msg);
    onlineUsers.set(userId, ws);
    console.log("User connected:", userId);
  });

  ws.on("close", () => {
    for (const [key, value] of onlineUsers.entries()) {
      if (value === ws) onlineUsers.delete(key);
    }
  });
});
const sendNotification = (data) => {
  console.log("data is:::", data);
  
  data.subscribersList.forEach((sub) => {  // Use forEach instead of map since you're not returning anything
    const ws = onlineUsers.get(sub.subscriber.toString());  // Convert ObjectId to string
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      const notificationData = {
        video: {
          ...data.video,
          owner: data.user
        }
      };
      
      ws.send(JSON.stringify(notificationData));
      console.log("Notification sent to:", sub.subscriber);
    }
  });
};

while (true) {
  try {
    const job = await redisClient.brPop("liveNotificationQueue", 0);

    if (job) {
      const data= JSON.parse(job.element);
      await sendNotification(data);
    //   console.log("Sent notification to", userId);
    }
  } catch (err) {
    console.error("Worker error:", err);
  }
}
