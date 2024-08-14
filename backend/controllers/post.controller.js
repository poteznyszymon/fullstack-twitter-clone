import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!text && !img) {
      return res.status(400).json({ error: "Text or image must be provided" });
    }

    if (img) {
      const imageResponse = await v2.uploader.upload(img);
      img = imageResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(200).json({ message: "Post added successfully" });
  } catch (error) {
    console.log("Error in createPost controller: ", error);
    req.status(500).json({ error: "Interal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (posts.length === 0) {
      return res.status(200).json({ posts: [], totalPages, currentPage: page });
    }

    res.status(200).json({ posts, totalPages, currentPage: page });
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
