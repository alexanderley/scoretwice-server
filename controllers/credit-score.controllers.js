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

  const user = req.payload; //double check this
  const { id } = req.params;
  console.log(req.payload);

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

// deleteCredit Score
const deleteCreditScore = asyncHandler(async (req, res) => {
  console.log("req params", req.params);
  console.log("delete CreditScore", req.user);

  const { id } = req.params;
  const userId = id;

  try {
    const deletedCreditScore = await CreditScore.findOneAndRemove({
      user: userId,
    });
    if (!deletedCreditScore) {
      return res
        .status(404)
        .json({ message: "Credit score not found for the user." });
    }

    res.json({ message: "Credit score deleted successfully." });
  } catch (error) {
    console.error("Error deleting credit score:", error);
    res.status(500).json({ message: "Error deleting credit score." });
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

module.exports = {
  createCreditScore,
  updateCreditScoreInputs,
  deleteCreditScore,
};
