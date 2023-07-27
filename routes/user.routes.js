const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

const router = express.Router();



// GET and find all the users
// access public
// route  api/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "firstName lastName _id");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});



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

// PUT and find user by id and update
// access private
// route  api/users/:id

router.put("/users/:id", (req, res, next) => {
  const { id } = req.params;
  console.log("payload", req.payload);
  // res.send("Connected to the route in the backend");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  const { email, password /* and other fields */ } = req.body;
  console.log("reqBody: ", req.body);

  const updates = {};

  if (email) updates.email = email;
  if (password) updates.password = bcrypt.hashSync(password, 10);
  console.log("updates:", updates);

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ message: "No valid fields to update" });
    return;
  }

  User.findByIdAndUpdate(
    id,
    updates,
    { new: true } // Return the updated user in the response
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json(updatedUser);
      }
    })
    .catch((error) =>
      res.status(500).json({ message: "Error updating user", error })
    );
});




// POST request to increase the account balance for a user
router.post("/users/:id/account", (req, res) => {
  const userId = req.params.id;
  const amountToIncrease = req.body.amount; // The amount to increase the account balance by

  // Find the user and populate the account field
  User.findById(userId)
    .populate("account")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      if (!user.account) {
        return res
          .status(404)
          .json({ error: "User does not have an account." });
      }

      // Increase the account balance
      user.account.balance += amountToIncrease;
      return user.account.save();
    })
    .then((updatedAccount) => {
      return res.json({
        message: "Account balance increased successfully.",
        newBalance: updatedAccount.balance,
      });
    })
    .catch((err) => {
      console.error("Error while increasing account balance:", err);
      return res.status(500).json({ error: "Internal server error." });
    });
});



// POST HARDRESET
router.post("/users/:id/resetaccountbalance", (req, res) => {
  const userId = req.params.id;
  const amountToIncrease = req.body.amount; // The amount to increase the account balance by

  // Find the user and populate the account field
  User.findById(userId)
    .populate("account")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      if (!user.account) {
        return res
          .status(404)
          .json({ error: "User does not have an account." });
      }

      // Increase the account balance
      user.account.balance = amountToIncrease;
      return user.account.save();
    })
    .then((updatedAccount) => {
      return res.json({
        message: "Account balance increased successfully.",
        newBalance: updatedAccount.balance,
      });
    })
    .catch((err) => {
      console.error("Error while increasing account balance:", err);
      return res.status(500).json({ error: "Internal server error." });
    });
});

module.exports = router;
