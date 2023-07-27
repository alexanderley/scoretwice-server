const mongoose = require("mongoose");

// Define the CreditScore schema
const creditScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  gender: { type: Boolean, required: true },
  carOwned: { type: Boolean, required: true },
  propertyOwned: { type: Boolean, required: true },
  childrenCount: { type: Number, required: true },
  annualIncome: { type: Number, required: true },
  educationLevel: {
    type: String,
    enum: [
      "lower secondary",
      "secondary",
      "incomplete higher",
      "higher education",
      "academic degree",
    ],
    required: true,
  },
  maritalStatus: {
    type: String,
    enum: [
      "Married",
      "Single/ not married",
      "Separated",
      "Widow",
      "Civil Marriage",
    ],
    required: true,
  },
  daysFromEmployment: { type: Date, required: true },
  ownedWorkphone: { type: Boolean, required: true },
  ownedEmail: { type: Boolean, required: true },
  creditStatus: { type: Boolean, required: true },

  // New field for the credit score grade (to be updated later)
  creditScoreGrade: { type: Number, required: false },
});

// Create the CreditScore model
const CreditScore = mongoose.model("CreditScore", creditScoreSchema);

// Export the model
module.exports = CreditScore;
