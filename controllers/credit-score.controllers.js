const CreditScore = require("../models/CreditScore.model");
const asyncHandler = require("express-async-handler");

// Create Credit Score inputs
const createCreditScore = asyncHandler(async (req, res) => {
  const {
    carOwned,
    propertyOwned,
    childrenCount,
    annualIncome,
    educationLevel,
    maritalStatus,
    daysFromEmployment,
    ownedEmail,
    ownedWorkphone,
    creditStatus,
  } = req.body; // Add the rest

  const user = req.user; //double check this
  console.log(req.user);

  if (!user) {
    res.status(400);
    throw new Error("LogIn necessary");
  }
  // check if User exists

  // Calculate the number of days from birth to the current date

  const creditScore = await CreditScore.create({
    user: user._id,
    gender: user.gender,
    carOwned,
    propertyOwned,
    childrenCount,
    annualIncome,
    educationLevel,
    maritalStatus,
    daysFromEmployment,
    ownedEmail,
    ownedWorkphone,
    creditStatus,
  });

  if (creditScore) {
    res.status(201).json({
      message: "credit score created",
    });
    console.log(req);
  } else {
    res.status(400);
    throw new Error("invalid input data");
  }
});

// Edit credit score inputs
const updateCreditScoreInputs = asyncHandler(async (req, res) => {
  console.log(req.user);
  const userId = req.user._id;
  const creditScore = await CreditScore.findOne({ user: userId });

  if (creditScore) {
    creditScore.carOwned = req.body.carOwned || creditScore.carOwned;
    creditScore.propertyOwned =
      req.body.propertyOwned || creditScore.propertyOwned;
    creditScore.childrenCount =
      req.body.childrenCount || creditScore.childrenCount;
    creditScore.annualIncome =
      req.body.annualIncome || creditScore.annualIncome;
    creditScore.educationLevel =
      req.body.educationLevel || creditScore.educationLevel;
    creditScore.maritalStatus =
      req.body.maritalStatus || creditScore.maritalStatus;
    creditScore.daysFromEmployment =
      req.body.daysFromEmployment || creditScore.daysFromEmployment;
    creditScore.ownedEmail = req.body.ownedEmail || creditScore.ownedEmail;
    creditScore.ownedWorkphone =
      req.body.ownedWorkphone || creditScore.ownedWorkphone;
    creditScore.creditStatus =
      req.body.creditStatus || creditScore.creditStatus;

    const updatedCreditScore = await creditScore.save();

    res.status(200).json({ message: "Updated creditScore info" });
  } else {
    res.status(400);
  }
});

// get credit score

module.exports = { createCreditScore, updateCreditScoreInputs };