const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Account = require("../models/Account.model");
const Transaction = require("../models/Transaction.model");

const app = express();
app.use(express.json());
const router = express.Router();

//POST TRANSACTION FROM USER1 TO USER2

router.post("/users/:senderId/transactions/:receiverId", (req, res) => {
  const senderId = req.params.senderId;
  const receiverId = req.params.receiverId;
  const amount = req.body.amount;
  const transferMessage = req.body.transferMessage;

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
        transferMessage: transferMessage,
      });

      // Update account balances
      sender.account.balance -= amount;
      receiver.account.balance += amount;

      // Update account transactions for sender and receiver
      sender.account.transactions.push(transaction._id);
      receiver.account.transactions.push(transaction._id);

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
        transferMessage: transferMessage,
        senderNewBalance: senderAccount.balance,
        receiverNewBalance: receiverAccount.balance,
      });
    })
    .catch((err) => {
      console.error("Error while processing transaction:", err);
      return res.status(500).json({ error: "Internal server error." });
    });
});

// GET all transactions for a specific user
router.get("/users/:userId/transactions", (req, res) => {
  const userId = req.params.userId;

  // Find all transactions for the specified user
  Transaction.find({ $or: [{ sender: userId }, { receiver: userId }] })
    .then((transactions) => {
      if (!transactions || transactions.length === 0) {
        return res
          .status(404)
          .json({ error: "No transactions found for the user." });
      }

      return res.json({ transactions: transactions });
    })
    .catch((err) => {
      console.error("Error while fetching transactions:", err);
      return res.status(500).json({ error: "Internal server error." });
    });
});

module.exports = router;
