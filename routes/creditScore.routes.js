const express = require("express");
const router = express.Router();
const {
  createCreditScore,
  updateCreditScoreInputs,
} = require("../controllers/credit-score.controllers");
const { getCreditScore } = require("../middleware/creditScore");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/credit-score", isAuthenticated, createCreditScore);
router.get("/credit-score/:userId");

router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload verify`, req.payload);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
});
// Post data from credit score form
// router.post("/credit-score", protect, createCreditScore);
//router.get("/credit-score/edit"); // not sure if we need one
// router.put("/credit-score/edit", protect, updateCreditScoreInputs);

module.exports = router;
