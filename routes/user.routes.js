const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

const router = express.Router();

// GET and find user by id
// access private
// route  api/users/:id

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

// GET and find user by id and update
// access private
// route  api/users/:id

router.put("/users/:id", (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Create an empty object to store the selective updates
  const updateFields = {};

  // Fields that can be updated selectively
  const allowedFields = [
    "username",
    "email",
    "password",
    "additionalField1",
    "additionalField2",
    "firstName",
    "lastName",
    "gender",
    "birthday",
  ];

  // Iterate through the allowedFields and check if they exist in the request body
  allowedFields.forEach((field) => {
    if (req.body.hasOwnProperty(field)) {
      // If the field exists in the request body, add it to the updateFields object
      if (field === "password") {
        // If updating the password, hash it before saving it to the database
        updateFields[field] = bcrypt.hashSync(req.body[field], 10);
      } else {
        updateFields[field] = req.body[field];
      }
    }
  });

  if (Object.keys(updateFields).length === 0) {
    res.status(400).json({ message: "No valid fields to update" });
    return;
  }

  User.findByIdAndUpdate(
    id,
    updateFields,
    { new: true } // This option returns the updated user data.
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json(updatedUser);
      }
    })
    .catch((error) => res.status(500).json({ message: "Error updating user", error }));
});

module.exports = router;
