const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authentication");
const { Account } = require("../models/bankbalance");
const { default: mongoose, mongo } = require("mongoose");
const { ObjectId } = mongoose.Types;


router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })
    const crrbalance = account.balance

    return res.status(200).json({
        msg: `balance:${account.balance}`,
        crrbalance
    })


})

router.put("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const senderId = new ObjectId(req.userId);
        const receiverId = new ObjectId(req.body.to);
        console.log(req.body.to)

        const sender = await Account.findOne({ userId: senderId }).session(session);

        if (!sender || sender.balance < req.body.amount) {
            await session.abortTransaction();
            console.log("Insufficient balance for sender");
            return res.status(400).json({ msg: "Insufficient balance" });
        }

        const receiver = await Account.findOne({ userId: receiverId }).session(session);

        console.log(receiver)
        if (!receiver) {
            await session.abortTransaction();
            console.log("Receiver not found");
            return res.status(400).json({ msg: "Invalid receiver account" });
        }

        await Account.updateOne(
            { userId: senderId },
            { $inc: { balance: -req.body.amount } }
        ).session(session);

        await Account.updateOne(
            { userId: receiverId },
            { $inc: { balance: req.body.amount } }
        ).session(session);

        await session.commitTransaction();
        console.log("Transfer successful");
        return res.status(200).json({ msg: "Transferred money successfully" });
    } catch (error) {
        await session.abortTransaction();
        console.error("Transaction error:", error);
        return res.status(500).json({ msg: "Transfer failed", error: error.message });
    } finally {
        session.endSession();
    }
});

module.exports =
    router
