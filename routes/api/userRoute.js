const router = require("express").Router();
const { User, Thought } = require("../../models");
const { findOneAndDelete } = require("../../models/User");

//Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-__v");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//creates new user
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("friends")
      .populate("thoughts");
    if (!user) {
      return res.status(404).json({ message: "No user found with this ID" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    );
    if (!user) {
      res.status(404).json({ message: "No user found with this ID" });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });
    if (!user) {
      res.status(404).json({ message: "No user found with this ID" });
      return;
    }
    await Thought.deleteMany({ _id: { $in: user.thoughts } });

    res.status(200).json({ message: "User and associated thoughts deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "No user found with this ID" });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "No user found with this ID" });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
