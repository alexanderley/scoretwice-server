const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { addTransaction } = require("../controllers/transactions.controllers");

// POST route to initiate a new transaction
router.post("/transactions", isAuthenticated, addTransaction);

module.exports = router;