const express = require("express");
const router = express.Router();
const {
  deleteCreditScore,
  createCreditScore,
  updateCreditScoreInputs,
} = require("../controllers/credit-score.controllers");
const { getCreditScore } = require("../middleware/creditScore");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/credit-score/:id/create", isAuthenticated, createCreditScore);
router.get("/credit-score/:id", isAuthenticated, getCreditScore);
router.delete("/credit-score/:id", isAuthenticated, deleteCreditScore);

// Post data from credit score form
// router.post("/credit-score", protect, createCreditScore);
//router.get("/credit-score/edit"); // not sure if we need one
// router.put("/credit-score/edit", protect, updateCreditScoreInputs);

module.exports = router;

// id for the creditscore
// 64c25b16ebd32409501c3b94
