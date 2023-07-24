// const asyncHandler = require("express-async-handler");
// const Account = require("../models/Account.model");
// const Transaction = require("../models/Transaction.model");

// // Controller function to add a new transaction
// const addTransaction = asyncHandler(async (req, res) => {
//   const { receiverId, amount } = req.body;
//   const senderId = req.user._id; // Assuming the authenticated user's ID is stored in req.user._id

//   try {
//     // Find the sender and receiver accounts in the database
//     const senderAccount = await Account.findOne({ owner: senderId });
//     const receiverAccount = await Account.findById(receiverId);

//     if (!senderAccount || !receiverAccount) {
//       res.status(404);
//       throw new Error("Sender or receiver account not found");
//     }

//     // Check if the sender has sufficient balance
//     if (senderAccount.balance < amount) {
//       res.status(400);
//       throw new Error("Insufficient balance");
//     }

//     // Deduct the amount from the sender's account
//     senderAccount.balance -= amount;
//     await senderAccount.save();

//     // Add the amount to the receiver's account
//     receiverAccount.balance += amount;
//     await receiverAccount.save();

//     // Create a new transaction record
//     const transaction = new Transaction({
//       sender: senderId,
//       receiver: receiverId,
//       amount,
//     });
//     await transaction.save();

//     res.status(200).json({ message: "Transaction successful" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = { addTransaction };