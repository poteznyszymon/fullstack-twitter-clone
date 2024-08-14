import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { createPost, getAllPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectedRoute, getAllPosts);
router.post("/create", protectedRoute, createPost);

export default router;
