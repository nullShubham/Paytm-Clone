const express = require("express");

const mainRouter = express.Router();

const userRouter = require("./user.js");
const accRouter = require("./account.js");
const historyRouter = require("./history.js");
mainRouter.use("/user", userRouter);
mainRouter.use("/account", accRouter);
mainRouter.use("/history", historyRouter)
module.exports = mainRouter;
