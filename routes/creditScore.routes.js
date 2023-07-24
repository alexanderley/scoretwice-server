const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createCreditScore,
  updateCreditScoreInputs,
} = require("../controllers/credit-score.controllers");

// Post data from credit score form
// router.post("/credit-score", protect, createCreditScore);
//router.get("/credit-score/edit"); // not sure if we need one
// router.put("/credit-score/edit", protect, updateCreditScoreInputs);

module.exports = router;
