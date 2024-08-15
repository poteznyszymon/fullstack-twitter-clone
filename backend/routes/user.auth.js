import express from "express";
import {
  getUserProfile,
  getSuggestedUsers,
  followUser,
  updateUser,
} from "../controllers/user.contoller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.get("/suggested", protectedRoute, getSuggestedUsers);
router.post("/follow/:id", protectedRoute, followUser);
router.post("/update", protectedRoute, updateUser);

export default router;
