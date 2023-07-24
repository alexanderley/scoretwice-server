const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Account = require("../models/Account.model");

const router = express.Router();
const saltRounds = 10;

const { isAuthenticated } = require("./../middleware/jwt.middleware.js"); // <== IMPORT

// POST       Registration
// ROUTE      "/signup"
// ACCESS     public

router.post("/signup", async (req, res, next) => {
  const { mail, password, firstName, lastName } = req.body;

  // Check if the mail, password, firstName, or lastName is provided as an empty string
  if (mail === "" || password === "" || firstName === "" || lastName === "") {
    res
      .status(400)
      .json({ message: "Provide mail, password, firstName, and lastName" });
    return;
  }

  // Use regex to validate the mail format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(mail)) {
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
    // Check if the user with the same email already exists
    const foundUser = await User.findOne({ mail });
    if (foundUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    // If the email is unique, proceed to hash the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user in the database
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Create an associated account for the user
    const newAccount = await Account.create({ owner: newUser._id });

    // Update the user's account field with the newly created account's ID
    newUser.account = newAccount._id;
    await newUser.save();

    // Deconstruct the newly created user object to omit the password
    const { email, firstName, lastName, _id } = newUser;

    // Create a new object that doesn't expose the password
    const user = { email, firstName, lastName, _id };

    // Send a json response containing the user object
    res.status(201).json({ user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST       Login
// ROUTE      "/login"
// ACCESS     public
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, name };

        // Create and sign the token
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        const responseObj = {
          authToken: authToken,
          foundUser: foundUser, // Include the user data in the response
        };

        // Send the token as the response
        // res.status(200).json({ authToken: authToken });
        res.status(200).json(responseObj);
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

// GET  /auth/verify

router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload verify`, req.payload);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
});

module.exports = router;
