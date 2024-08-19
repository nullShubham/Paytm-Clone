const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const mainRouter = require("./Routes/index.js");

const PORT = process.env.PORT;


app.use("/api/v1", mainRouter);

app.listen(PORT, () => {
  console.log("Server Started....");
});
