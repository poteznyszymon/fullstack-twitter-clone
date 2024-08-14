import express from "express";
import {
  getUserProfile,
  getSuggestedUsers,
  followUser,
} from "../controllers/user.contoller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.post("/follow/:id", protectedRoute, followUser);
router.get("/suggested", protectedRoute, getSuggestedUsers);

export default router;
