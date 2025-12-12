import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleLogin, handleRegister, handleGetMe } from "./routes/users";
import { handleGetPosts, handleCreatePost } from "./routes/posts";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // User authentication routes
  app.post("/users/login", handleLogin);
  app.post("/users/register", handleRegister);
  app.get("/users/me", handleGetMe);

  // Content routes
  app.get("/posts", handleGetPosts);
  app.post("/posts", handleCreatePost);

  return app;
}
