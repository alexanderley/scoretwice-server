const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = express.Router();
const saltRounds = 10;

router.get("/users/:id", (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  User.findById(id)
    .then((user) => res.status(200).json(user))
    .catch((error) => res.json(error));
});

module.exports = router;
