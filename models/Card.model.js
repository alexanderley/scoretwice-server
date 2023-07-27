const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  isOn: { type: Boolean, default: true },
  pin: { type: String, required: true },
  iban: { type: String, required: true },
  bic: { type: String, required: true },
});

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
