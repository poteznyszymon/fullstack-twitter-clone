import User from "../models/userModel.js";

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

      // SENT NOTIFICATION

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUser contoller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
