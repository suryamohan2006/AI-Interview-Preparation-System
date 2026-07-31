const express = require("express");
const router = express.Router();
const Interview = require("../models/interview");

router.post("/create", async (req, res) => {
    try {
        const interview = new Interview(req.body);
        await interview.save();

        res.status(201).json({
            message: "Interview created successfully",
            interview
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating interview",
            error: error.message
        });
    }
});
// Get all interviews
router.get("/history", async (req, res) => {
    try {
        const interviews = await Interview.find().sort({ createdAt: -1 });
        res.json(interviews);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching interview history",
            error: error.message
        });
    }
});

module.exports = router;