import { generateTokenAndSetCookie } from "../lib/utils/generateTokens.js";
import User from "../models/userModel.js";
import bycrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (password.lenght < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(200).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        bio: newUser.bio,
        followers: newUser.followers,
        following: newUser.following,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in register controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const isPasswordCorrect = await bycrypt.compare(
      password,
      user?.password || ""
    );

    if (!isPasswordCorrect || !user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullname,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User logout successfully" });
  } catch (error) {
    console.log("error in logout controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("error in getme controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
