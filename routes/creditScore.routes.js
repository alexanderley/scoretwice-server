const express = require("express");
const router = express.Router();
const {
  createCreditScore,
  updateCreditScoreInputs,
} = require("../controllers/credit-score.controllers");
const { getCreditScore } = require("../middleware/creditScore");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/credit-score/create", isAuthenticated, createCreditScore);
router.get("/credit-score", isAuthenticated, getCreditScore);

// Post data from credit score form
// router.post("/credit-score", protect, createCreditScore);
//router.get("/credit-score/edit"); // not sure if we need one
// router.put("/credit-score/edit", protect, updateCreditScoreInputs);

module.exports = router;
