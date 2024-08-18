import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  createPost,
  getAllPosts,
  getFollowingPosts,
  likePost,
  getUserPosts,
  getLikedPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectedRoute, getAllPosts);
router.get("/following", protectedRoute, getFollowingPosts);
router.get("/user/:username", protectedRoute, getUserPosts);
router.get("/liked/:id", protectedRoute, getLikedPosts);
router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, likePost);

export default router;
