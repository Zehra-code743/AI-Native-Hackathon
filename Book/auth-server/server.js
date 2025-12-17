import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "0.0.0.0";

// CORS configuration - whitelist all required origins
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://ai-native-hackathon-hbpn-git-001-00fd08-shan-e-zehras-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"]
  })
);

// Better-Auth routes MUST come before other middleware
app.all("/api/auth/*", toNodeHandler(auth));

// Other middleware AFTER auth handler
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Auth Server", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Better-Auth Server for AI Robotics Book",
    endpoints: {
      health: "/health",
      auth: "/api/auth/*"
    }
  });
});

app.listen(PORT, HOST, () => {
  console.log(`✅ Auth server running on http://${HOST}:${PORT}`);
  console.log(`📍 Health check: http://${HOST}:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://${HOST}:${PORT}/api/auth/*`);
});
