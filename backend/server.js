import express from "express";
import dotenv from "dotenv";
import connectMongoDb from "./database/connectDatabse.js";
import { v2 } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.auth.js";
import postRoutes from "./routes/post.route.js";

import cookieParser from "cookie-parser";

dotenv.config();

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
  connectMongoDb();
});
