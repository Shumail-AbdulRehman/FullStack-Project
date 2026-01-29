import WebSocket, { WebSocketServer } from "ws";
import { createClient } from "redis";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import "dotenv/config";

const PORT = process.env.WS_PORT || 8080;
const wss = new WebSocketServer({ port: PORT });
console.log(`WebSocket server running on port ${PORT}`);

const redisClient = createClient();
await redisClient.connect();

// Map userId -> Set of WebSocket connections (allows multiple tabs/devices)
const onlineUsers = new Map();

// Helper to add a connection for a user
const addUserConnection = (userId, ws) => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(ws);
  ws.userId = userId; // Store userId on the socket for cleanup
  console.log(`User ${userId} connected. Active connections: ${onlineUsers.get(userId).size}`);
};

// Helper to remove a connection for a user
const removeUserConnection = (ws) => {
  const userId = ws.userId;
  if (userId && onlineUsers.has(userId)) {
    onlineUsers.get(userId).delete(ws);
    if (onlineUsers.get(userId).size === 0) {
      onlineUsers.delete(userId);
    }
    console.log(`User ${userId} disconnected.`);
  }
};

// Heartbeat to detect dead connections
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      removeUserConnection(ws);
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000); // Every 30 seconds

wss.on("close", () => {
  clearInterval(heartbeatInterval);
});

wss.on("connection", (ws, req) => {
  ws.isAlive = true;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  // Try cookie-based authentication first
  const rawCookie = req?.headers?.cookie || "";
  const parsedCookie = cookie.parse(rawCookie);

  if (parsedCookie.accessToken) {
    try {
      const decodedInfo = jwt.verify(parsedCookie.accessToken, process.env.ACCESS_TOKEN_SECRET);
      const userId = decodedInfo._id;
      addUserConnection(userId, ws);
    } catch (error) {
      console.log("Cookie token verification failed:", error.message);
      // Don't close - allow message-based registration as fallback
    }
  }

  // Handle messages (for registration and potential future features)
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "register" && data.userId) {
        // Only register if not already authenticated via cookie
        if (!ws.userId) {
          addUserConnection(data.userId, ws);
        }
      }
    } catch (err) {
      console.error("Error parsing message:", err.message);
    }
  });

  ws.on("close", () => {
    removeUserConnection(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error.message);
    removeUserConnection(ws);
  });
});

const sendNotification = (data) => {
  if (!data.subscribersList) return;

  data.subscribersList.forEach((sub) => {
    const subscriberId = sub.subscriber.toString();
    const connections = onlineUsers.get(subscriberId);

    if (connections) {
      const notificationData = {
        video: { ...data.video, owner: data.user }
      };
      const payload = JSON.stringify(notificationData);

      // Send to all connections for this user (multiple tabs/devices)
      connections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
          console.log("Notification sent to:", subscriberId);
        }
      });
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

  clearInterval(heartbeatInterval);

  // Close all connections gracefully
  wss.clients.forEach((ws) => {
    ws.close(1001, "Server shutting down");
  });

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