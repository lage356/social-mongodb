const router = require("express").Router();
const { User, Thought } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 });
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { thoughts: thought._id } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "No user found with this ID" });
      return;
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId });
    if (!thought) {
      res.status(404).json({ message: "No thought found with this ID" });
      return;
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    );
    if (!thought) {
      res.status(404).json({ message: "No thought found with this ID" });
      return;
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findOneAndDelete({
      _id: req.params.thoughtId,
    });
    if (!thought) {
      res.status(404).json({ message: "No thought found with this ID" });
      return;
    }
    const user = await User.findOneAndUpdate(
      { _id: thought.userId },
      { $pull: { thoughts: thought._id } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "No user found with this ID" });
      return;
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true }
    );
    if (!thought) {
      res.status(404).json({ message: "No thought found with this ID" });
      return;
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );
    if (!thought) {
      res.status(404).json({ message: "No thought found with this ID" });
      return;
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
