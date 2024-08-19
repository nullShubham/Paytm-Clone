const express = require("express");
const authMiddleware = require("../middleware");
const { HistoryOfTransaction } = require("../DB");
const historyRouter = express.Router();

historyRouter.post("/gethistory", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const response = await HistoryOfTransaction.findOne({ userId })
        if (!response) {
            return res.status(400).json({
                message: "User transaction history not found"
            });
        }
        return res.status(200).json({
            transactionsHistory: response.transactions,
            yourId: userId
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error in finding user transaction history"
        });
    }
})


module.exports = historyRouter