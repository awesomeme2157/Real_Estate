import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import postRoutes from "./routes/post.route.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
dotenv.config();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8800, () => {
  console.log("Server is running on port 8800");
});
