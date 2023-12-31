const AsyncHandler = require("express-async-handler");
const CreditScore = require("../models/CreditScore.model");

function calculateCreditScore(creditScore) {
  const {
    annualIncome,
    educationLevel,
    maritalStatus,
    gender,
    carOwned,
    propertyOwned,
    childrenCount,
    ownedWorkphone,
    daysFromEmployment,
    ownedEmail,
    creditStatus,
  } = creditScore;

  let score = 0;

  // Credit score based on annual income (maximum 300 points)
  if (annualIncome >= 100000) score += 300;
  else if (annualIncome >= 70000) score += 250;
  else if (annualIncome >= 50000) score += 200;
  else if (annualIncome >= 30000) score += 150;
  else if (annualIncome >= 20000) score += 100;
  else if (annualIncome >= 10000) score += 50;

  // Credit score based on education level (maximum 150 points)
  if (educationLevel === 5) score += 150;
  else if (educationLevel >= 4) score += 120;
  else if (educationLevel >= 3) score += 90;
  else if (educationLevel >= 2) score += 60;
  else if (educationLevel >= 1) score += 30;

  // Credit score based on marital status (maximum 100 points)
  if (maritalStatus === 5 || maritalStatus === 4) score += 100;
  else if (maritalStatus === 3) score += 80;
  else if (maritalStatus === 2) score += 50;
  else if (maritalStatus === 1) score += 30;

  // Additional credit score based on other factors (maximum 250 points)
  if (gender) score += 20;
  if (carOwned) score += 40;
  if (propertyOwned) score += 130;
  if (ownedWorkphone) score += 20;
  if (ownedEmail) score += 20;

  if (childrenCount === 0) score += 20;
  else if (childrenCount === 1) score -= 10;
  else if (childrenCount === 2) score -= 30;
  else if (childrenCount >= 3) score -= 50;

  if (daysFromEmployment <= 365) score += 10;
  if (daysFromEmployment > 365 && daysFromEmployment <= 1095) score += 50;
  if (daysFromEmployment > 1095) score += 100;

  // Credit Status means if the person has a credit or not
  if (!creditStatus) score += 100;

  // Ensure the credit score is within the range [0, 1000]
  score = Math.min(1000, Math.max(0, score));

  return score;
}

const getCreditScore = AsyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const userId = req.payload._id;

  const creditScore = await CreditScore.findOne({ user: userId });
  console.log("credit Score", creditScore);

  if (creditScore) {
    // Data Transformation

    const educationLevelMap = {
      "lower secondary": 1,
      "secondary": 2,
      "incomplete higher": 3,
      "higher education": 4,
      "academic degree": 5,
    };

    const maritalStatusMap = {
      "Married": 5,
      "Single/ not married": 1,
      "Separated": 2,
      "Widow": 3,
      "Civil marriage": 4,
    };


    const creditScoreCopy = {...creditScore._doc};
    console.log("Copy", creditScoreCopy)

    creditScoreCopy.educationLevel = educationLevelMap[creditScoreCopy.educationLevel];
    creditScoreCopy.maritalStatus = maritalStatusMap[creditScoreCopy.maritalStatus];
    
    const employmentStartDate = creditScoreCopy.daysFromEmployment;
    const currentDate = new Date();
    const employmentTimeDiff = currentDate.getTime() - employmentStartDate.getTime();
    
    creditScoreCopy.daysFromEmployment = Math.floor(employmentTimeDiff / (1000 * 3600 * 24));
    console.log(creditScoreCopy.daysFromEmployment)

    // Calculate Score using calculate function, based on the temporary copy
    creditScoreCopy.creditScoreGrade = calculateCreditScore(creditScoreCopy);


    // creditScore.educationLevel = educationLevelMap[creditScore.educationLevel];
    // creditScore.maritalStatus = maritalStatusMap[creditScore.maritalStatus];

    // const employmentStartDate = creditScore.daysFromEmployment;
    // const currentDate = new Date();
    // const employmentTimeDiff =
    //   currentDate.getTime() - employmentStartDate.getTime();

    // creditScore.daysFromEmployment = Math.floor(
    //   employmentTimeDiff / (1000 * 3600 * 24)
    // );

    // Calculate Score using calculate function, based on data
    creditScore.creditScoreGrade =  creditScoreCopy.creditScoreGrade;

    await creditScore.save()
    
res.status(200).json(creditScore)
   
    //   // Use the `populate` method to populate the `account` field if it exists
    //   User.findById(id)
    //     .populate("account")
    //     .then((user) => {
    //       if (!user) {
    //         res.status(404).json({ message: "User not found" });
    //       } else {
    //         res.status(200).json(user);
    //       }
    //     })
    //     .catch((error) => res.json(error));
    // });
  

  } else res.status(400).json({message: "Credit score not found for user"})
});

module.exports = { getCreditScore };
