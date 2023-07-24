const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Account = require("../models/Account.model");
const Transaction = require("../models/Transaction.model");

const app = express();
app.use(express.json());
const router = express.Router();

router.post("/users/:senderId/transactions/:receiverId", (req, res) => {
  const senderId = req.params.senderId;
  const receiverId = req.params.receiverId;
  const amount = req.body.amount;

  // Find the sender and receiver users and their accounts
  Promise.all([
    User.findById(senderId).populate("account"),
    User.findById(receiverId).populate("account"),
  ])
    .then(([sender, receiver]) => {
      if (!sender || !receiver) {
        return res.status(404).json({ error: "One or both users not found." });
      }

      if (!sender.account || !receiver.account) {
        return res
          .status(404)
          .json({ error: "One or both users do not have an account." });
      }

      if (sender.account.balance < amount) {
        return res
          .status(400)
          .json({ error: "Insufficient balance for the transaction." });
      }

      // Create a new transaction
      const transaction = new Transaction({
        sender: senderId,
        receiver: receiverId,
        amount: amount,
      });

      // Update account balances
      sender.account.balance -= amount;
      receiver.account.balance += amount;

      return Promise.all([
        transaction.save(),
        sender.account.save(),
        receiver.account.save(),
      ]);
    })
    .then(([transaction, senderAccount, receiverAccount]) => {
      return res.json({
        message: "Transaction successful.",
        transaction: transaction,
        senderNewBalance: senderAccount.balance,
        receiverNewBalance: receiverAccount.balance,
      });
    })
    .catch((err) => {
      console.error("Error while processing transaction:", err);
      return res.status(500).json({ error: "Internal server error." });
    });
});

module.exports = router;
