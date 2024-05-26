import express from "express";
import type { NextFunction, Request, Response } from "express";
import { Socket } from "socket.io";
import { createServer } from "http";
import RedisStore from "connect-redis";
import redis from "redis";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";
import submissionRoutes from "./routes/submissions";

declare global {
  namespace Express {
    interface Request {
      io: Socket;
    }
  }
}

const app = express();
const server = createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  pingInterval: 3000,
});
redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch(() => {
    console.log("Redis Connection Closed");
  });

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "session:",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    store: redisStore,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/submissions", submissionRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
