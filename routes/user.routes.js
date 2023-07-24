const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User.model");

const router = express.Router();

router.get("/users/:id", (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Use the `populate` method to populate the `account` field if it exists
  User.findById(id)
    .populate("account")
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json(user);
      }
    })
    .catch((error) => res.json(error));
});

module.exports = router;