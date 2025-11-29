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
    console.log("data is:::",data);
    data.subscribersList.map((sub)=>
    {
        const ws=onlineUsers.get(sub.subscriber)

        if(ws && ws.readyState=== WebSocket.OPEN)
        {
            ws.send(JSON.stringify({video:data.video,owner:data.user}))
        }
    }) 
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
