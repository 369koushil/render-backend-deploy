const express = require("express");
const { User } = require("../models/user");
const { Account } = require("../models/bankbalance");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const router = express.Router();
const {
  Signupvalidation,
  updateValid,
} = require("../middlewares/zodValidation");
require("dotenv").config();
const { authMiddleware } = require("../middlewares/authentication");

router.post("/signup", Signupvalidation, async (req, res) => {
  const body = req.body;
  const existingUser = await User.findOne({ username: body.username });
  if (existingUser) {
    return res.status(411).json({
      msg: "user already exists, try another email",
    });
  }

  const user = await User.create(body);
  const userId = user._id;

  const acc = await Account.create({
    userId,
    balance: 1 + Math.floor(Math.random() * 10000),
  });
  const token = jwt.sign({ user_id: userId }, process.env.JWT_SECRET);

  res.status(201).json({
    msg: "user created successfully",
    token,
  });
});

router.post("/signin", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({ username: body.username });
  if (!user) {
    return res.status(400).json({
      msg: "user donot exists",
    });
  }
  console.log(user.password);
  if (user && user.password != body.password) {
    return res.status(400).json({
      msg: "invalid password",
    });
  }

  const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET);
  console.log(user);
  console.log(token);
  res.status(202).json({
    msg: "sucessfully signin",
    user,
    token,
  });
});

router.get("/info", authMiddleware, async (req, res) => {
  const user = await User.findOne({
    _id: req.userId,
  });
  if (!user) {
    return res.status(400).json({
      msg: "user not found",
      code: 400,
    });
  }
  return res.status(200).json({
    user,
    code: 200,
  });
});

router.put("/update", authMiddleware, async (req, res) => {
  const body = req.body;
  const id = new ObjectId(req.userId);
  console.log(body);
  console.log(req.userId);
  const updateuser = await User.updateOne(
    {
      _id: id,
    },
    { $set: body }
  );
  console.log(updateuser);
  if (updateuser.modifiedCount == 0) {
    console.log(updateuser.modifiedCount);
    return res.status(500).json({
      msg: "error occured while updating",
    });
  }
  return res.status(200).json({
    msg: "updated successfully",
  });
});

router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  try {
    const userArr = await User.find({
      $or: [
        {
          fName: {
            $regex: filter,
          },
        },
        {
          lName: {
            $regex: filter,
          },
        },
      ],
    });

    const usersModif = userArr.filter((u) => {
      if (u._id != req.userId) {
        return {
          username: u.username,
          fName: u.fName,
          lName: u.lName,
          id: u._id,
        };
      }
    });

    res.json({ usersModif });
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching users",
      error: error.message,
    });
  }
});

module.exports = router;
