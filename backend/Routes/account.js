const express = require("express");
const zod = require("zod");
const accRouter = express.Router();
const authMiddleware = require("../middleware");
const { Account, HistoryOfTransaction } = require("../DB.js");
const mongoose = require("mongoose");

accRouter.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({
      userId: req.userId,
    });
    res.status(200).json({
      balance: account.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching balance",
      error: error.message,
    });
  }
});

const transferSchema = zod.object({
  to: zod.string(),
  amount: zod.number().positive({ message: "Amount must be a positive number" }).int({ message: "Amount must be an integer" }),
});



accRouter.post("/transfer", authMiddleware, async (req, res) => {
  const { success, error } = transferSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: error.issues[0].message,
    });
  }


  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const toUserId = req.body.to;
    const userId = req.userId;
    if (userId === toUserId) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Sender and recipient cannot be the same",
      });
    }

    let fromAccount = await Account.findOne({ userId: userId }).session(
      session
    );
    if (!fromAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Sender account not found",
      });
    }
    if (fromAccount.balance < req.body.amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    let toAccount = await Account.findOne({ userId: toUserId }).session(
      session
    );
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Recipient account not found",
      });
    }
    const createdAt = new Date()
    const historyForSender = {
      toUserId,
      amount: req.body.amount,
      transactionId: userId,
      createdAt
    }

    const historyForReciever = {
      fromUserId: userId,
      amount: req.body.amount,
      transactionId: userId,
      createdAt
    }
    // Perform the transfer

    fromAccount.balance -= req.body.amount;
    toAccount.balance += req.body.amount;
    // history for sender
    await HistoryOfTransaction.findOneAndUpdate(
      { userId: userId },
      { $push: { transactions: historyForSender } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).session(session)

    // history for reciever
    await HistoryOfTransaction.findOneAndUpdate(
      { userId: toUserId },
      { $push: { transactions: historyForReciever } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).session(session)

    await fromAccount.save({ session })
    await toAccount.save({ session })
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      message: "Transfer successful",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({
      message: "Error processing transfer",
      error: error.message,
    });
  }
});
module.exports = accRouter;
