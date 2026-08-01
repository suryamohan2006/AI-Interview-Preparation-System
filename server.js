require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const User = require("./models/user");
const Interview = require("./models/interview");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/AIInterviewDB")
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.log("MongoDB Error:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// Interview Routes
app.use("/api/interviews", interviewRoutes);

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
// Register User
app.post("/register", async (req, res) => {
    console.log("Register route called");
    console.log(req.body);

    try {
        const { name, email, password } = req.body;

        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        console.log("✅ User saved successfully!");
        console.log(user);

        res.redirect("/login.html");
    } catch (err) {
        console.log("Error:", err);
        res.status(500).send("Registration Failed");
    }
});
// Login User
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (user) {
            console.log("✅ Login Successful:", user.email);
            res.redirect("/dashboard.html");
        } else {
            console.log("❌ Invalid Email or Password");
            res.send("Invalid Email or Password");
        }

    } catch (err) {
        console.log("Error:", err);
        res.status(500).send("Login Failed");
    }
});
app.post("/api/ai-feedback", async (req, res) => {

    console.log("✅ Local AI Feedback Route Called");

    try {

        const { question, answer } = req.body;

        let feedback = "";

        const length = answer.length;

        if (length >= 100) {

            feedback =
            "Excellent answer! Your explanation is detailed. Try adding real-world examples and technical concepts to make it even stronger.";

        }
        else if (length >= 50) {

            feedback =
            "Good response! You explained the concept clearly. Add more technical details and examples to improve.";

        }
        else if (length >= 20) {

            feedback =
            "Your response covers the basic idea. Improve it by explaining the concept in more detail and adding relevant examples.";

        }
        else {

            feedback =
            "Your answer is too brief. Try providing a complete explanation with definitions, key points and examples.";

        }

        let score = 0;

        if (length >= 100) {
            score = 5;
        } else if (length >= 50) {
            score = 4;
        } else if (length >= 20) {
            score = 3;
        } else if (length >= 10) {
            score = 2;
        } else {
            score = 0;
        }

        res.json({
            score,
            feedback
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            score: 0,
            feedback: "Unable to generate feedback."
        });

    }

});
app.get("/api/interviews/summary", async (req, res) => {

    try {

        const interviews = await Interview.find();

        const totalInterviews = interviews.length;

        let totalScore = 0;
        let bestScore = 0;

        interviews.forEach(interview => {

            totalScore += interview.overallScore;

            if (interview.overallScore > bestScore) {
                bestScore = interview.overallScore;
            }

        });

        const averageScore =
            totalInterviews > 0
            ? (totalScore / totalInterviews).toFixed(1)
            : 0;

        res.json({
            totalInterviews,
            averageScore,
            bestScore
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to load dashboard summary."
        });

    }

});
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});