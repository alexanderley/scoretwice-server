const mongoose = require("mongoose");

// Function to generate random IBAN for a specific country code (e.g., DE for Germany)
function generateRandomIBAN(countryCode) {
  const randomNumbers = Math.floor(Math.random() * 99999999999)
    .toString()
    .padStart(11, "0");
  const iban = `${countryCode}${randomNumbers}`;
  return iban;
}

// Function to get a random country code from the list
function getRandomCountryCode() {
  const countryCodes = [
    "AL",
    "AD",
    "AT",
    "AZ",
    "BH",
    "BE",
    "BA",
    "BR",
    "BG",
    "CR",
    "HR",
    "CY",
    "CZ",
    "DK",
    "DO",
    "TL",
    "EE",
    "FO",
    "FI",
    "FR",
    "GE",
    "DE",
    "GI",
    "GR",
    "GL",
    "GT",
    "HU",
    "IS",
    "IQ",
    "IE",
    "IL",
    "IT",
    "JO",
    "KZ",
    "XK",
    "KW",
    "LV",
    "LB",
    "LI",
    "LT",
    "LU",
    "MK",
    "MT",
    "MR",
    "MU",
    "MC",
    "MD",
    "ME",
    "NL",
    "NO",
    "PK",
    "PS",
    "PL",
    "PT",
    "QA",
    "RO",
    "LC",
    "SM",
    "ST",
    "SA",
    "RS",
    "SC",
    "SK",
    "SI",
    "ES",
    "SE",
    "CH",
    "TN",
    "TR",
    "UA",
    "AE",
    "GB",
    "VA",
    "VG",
    "UA",
  ];

  return countryCodes[Math.floor(Math.random() * countryCodes.length)];
}

const accountSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, default: 0 },
  iban: {
    type: String,
    unique: true,
    required: false,
  },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
});

// Pre-save hook to generate IBAN if not provided
accountSchema.pre("save", function (next) {
  if (!this.iban) {
    this.iban = generateRandomIBAN(getRandomCountryCode());
  }
  next();
});

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;
