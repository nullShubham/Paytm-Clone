const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");
const zod = require("zod");
const userRouter = express.Router();
const { Account, User, HistoryOfTransaction } = require("../DB.js");
const authMiddleware = require("../middleware.js");
const { default: mongoose } = require("mongoose");

const alphaOnly = zod.string().regex(/^[A-Za-z0-9]*$/, "Names contain only alphabets and numbers,no spaces");

const signupSchema = zod.object({
  userName: zod.string().email({ message: "Enter Correct Email" }),
  password: zod
    .string()
    .min(8, { message: "Password should be of minimum 8 letters" }),
  firstName: alphaOnly,
  lastName: alphaOnly,
});

userRouter.post("/signup", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction()
  try {
    let { firstName, lastName, password, userName } = req.body;
    // error if not all inputs filled
    if (!firstName || !lastName || !password || !userName) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Send all inputs" });
    }
    // checking schema validation
    const parsedRes = signupSchema.safeParse(req.body);
    if (!parsedRes.success) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: parsedRes.error.issues[0].message,
      });
    }
    // check if user exist with same userName
    const existingUser = await User.findOne({ userName }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(411).json({
        message: "Email already taken",
      });
    }
    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    //   save user info
    const dbUser = await User.create([{ firstName, lastName, password: hashedPassword, userName }], { session });
    const userId = dbUser[0]._id;

    // save amount in user Account
    await Account.create([{
      userId,
      balance: 1 + Math.floor(Math.random() * 10000),
    }], { session });

    await session.commitTransaction();
    session.endSession();
    const token = jwt.sign({ userId, }, JWT_SECRET);

    res.status(201).json({
      message: "User Created Successfully",
      token,
      firstName
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const signInSchema = zod.object({
  userName: zod.string().email({ message: "Enter Correct Email" }),
  password: zod
    .string()
    .min(8, { message: "Password should be of minimum 8 letters" }),
});

userRouter.post("/signin", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const parsedRes = signInSchema.safeParse(req.body);

    if (!parsedRes.success) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: parsedRes.error.issues[0].message,
      });
    }

    const user = await User.findOne({ userName: req.body.userName, }).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({
        message: "No user found",
      });
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );
    await session.commitTransaction();
    session.endSession();
    res.json({
      token,
      firstName: user.firstName
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" })
  }
});

const updateBodySchema = zod.object({
  password: zod
    .string()
    .min(8, { message: "Password should be of minimum 8 letters" })
    .optional(),
  firstName: alphaOnly.optional(),
  lastName: alphaOnly.optional(),
});

userRouter.put("/", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { success, error } = updateBodySchema.safeParse(req.body);
  if (!success) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({
      message: error.issues[0].message,
    });
  }
  try {
    const UpdatedData = { ...req.body }
    if (UpdatedData.password) {
      UpdatedData.password = await bcrypt.hash(UpdatedData.password, 10);
    }

    const result = await User.updateOne(
      {
        _id: req.userId,
      },
      { $set: UpdatedData },
      { session }
    );

    if (result.modifiedCount === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "User not found or Already Changed",
      });
    }
    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: "Updated successfully",
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
});

userRouter.get("/bulk", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const filter = req.query.filter || "";
  try {
    // Escaping special characters in the filter string to prevent regex injection
    const escapedFilter = filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


    const users = await User.find({
      userName: {
        $regex: escapedFilter,
        $options: "i",
      },
    }).session(session);
    await session.commitTransaction();
    session.endSession();
    res.json({
      user: users.filter(user => user._id != req.userId).
        map((user) => ({
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id,
        }))
    })
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
});


userRouter.delete("/delete", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.userId;
    const userDetails = await User.findByIdAndDelete(userId).session(session)
    const userAccMoney = await Account.findOneAndDelete({ userId }).session(session);
    await HistoryOfTransaction.findOneAndDelete({ userId }).session(session)

    if (userDetails && userAccMoney) {
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({ message: 'User deleted' });
    }
    else {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        message: 'User or account not found'
      })
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: 'Error deleting user and account' });
  }
})


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ isUserLoggedIn: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ isUserLoggedIn: false, message: "Forbidden" });
  }
};


userRouter.post("/me", authenticateToken, (req, res) => {
  if (req.user && req.user.userId) {
    return res.status(200).json({ isUserLoggedIn: true });
  } else {
    return res.status(403).json({ isUserLoggedIn: false, message: "User not found" });
  }
})

userRouter.post("/userName", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(404).json({
      message: "Error In Finding Id"
    })
  }
  try {
    const result = await User.findOne({ _id: id })
    if (result) {
      return res.status(200).json({
        userName: result.userName
      })
    }
    else {
      return res.status(200).json({
        userName: "Account Deleted"
      })
    }
  } catch (error) {
    return res.status(404).json({
      message: "Some Error Occured"
    })
  }
})

module.exports = userRouter;
