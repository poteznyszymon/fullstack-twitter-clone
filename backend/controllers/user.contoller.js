import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import bcrypt from "bcryptjs";
import { v2 } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const userFollowed = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !userFollowed.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggestedUsers contoller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const followUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const currentUser = await User.findById(userId);
    const userToModify = await User.findById(id);

    if (id.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }
    if (!currentUser || !userToModify) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { following: id } });

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: userId } });
      await User.findByIdAndUpdate(userId, { $push: { following: id } });

      const notification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await notification.save();
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUser contoller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  const { fullname, username, email, link, bio, currentPassword, newPassword } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res
        .status(400)
        .json({ error: "You didn't provide both passwords" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.isMatch(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }
      const salt = bcrypt.genSalt(10);
      user.password = bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await v2.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadResponse = await v2.uploader.upload(profileImg);
      profileImg = uploadResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await v2.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
      }
      const uploadResponse = await v2.uploader.upload(coverImg);
      coverImg = uploadResponse.secure_url;
    }

    user.fullname = fullname || user.fullname;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    return res
      .status(200)
      .json({ message: "User profile updated successfully" });
  } catch (error) {
    console.log("Error in updateUser controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
