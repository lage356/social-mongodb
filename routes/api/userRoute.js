const router = require("express").Router();
const { User, Thought } = require("../../models");
const { findOneAndDelete } = require("../../models/User");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-__v");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
