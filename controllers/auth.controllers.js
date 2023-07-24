const asyncHandler = require("express-async-handler");
const User = require("../models/User.model");
const Account = require("../models/Account.model");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @description   Register new user
// route          POST/ "/"
// @access        Public
const registerUser = async (req, res) => {
  const { email, password, firstName, lastName, gender, birthday } = req.body;
  console.log("req.body: ", req.body);

  // Check if the email or password or name is provided as an empty string
  if (email === "" || password === "" || firstName === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  try {
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const saltRounds = 10;
    // If the email is unique, proceed to hash the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log("cona", hashedPassword);

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      gender,
      birthday,
    });

    console.log(createdUser);

    if (createdUser) {
      const account = await Account.create({
        owner: createdUser._id,
      });

      const updatedUser = await User.findByIdAndUpdate(
        createdUser._id,
        { account: account._id },
        { new: true }
      ).populate("account");

      res.status(201).json({ user: updatedUser });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { registerUser };
