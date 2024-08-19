const mongoose = require("mongoose");
require("dotenv").config()

// connect mongodb
const mongodbUrl = process.env.MONGODB_URL;

mongoose
  .connect(mongodbUrl)
// mogoose schema

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLenght: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLenght: 50,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLenght: 30,
  },
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },

});

const transactionSchema = new mongoose.Schema({
  toUserId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
  },
  amount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    required: true
  }
});


const historyOfTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    required: true
  },
  transactions: [transactionSchema]
})

const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User", userSchema);
const HistoryOfTransaction = mongoose.model("HistoryOfTransaction", historyOfTransactionSchema)
module.exports = { User, Account, HistoryOfTransaction };
