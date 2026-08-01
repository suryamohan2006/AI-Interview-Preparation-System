// Start Interview
function startInterview(subject) {
    localStorage.setItem("selectedSubject", subject);
    window.location.href = "interview.html";
}

// Questions
const questions = {
    Python: [
        "What is Python?",
        "What is a list in Python?",
        "Explain tuple and list difference.",
        "What is a dictionary?",
        "What are Python modules?"
    ],

    Java: [
        "What is Java?",
        "Explain OOP concepts.",
        "What is inheritance?",
        "What is polymorphism?",
        "What is JVM?"
    ],

    SQL: [
        "What is SQL?",
        "What is a Primary Key?",
        "What is a Foreign Key?",
        "What is a JOIN?",
        "Difference between DELETE and TRUNCATE?"
    ],

    "Data Science": [
        "What is Data Science?",
        "What is Machine Learning?",
        "What is Pandas?",
        "What is Overfitting?",
        "Explain Supervised Learning."
    ],

    HR: [
        "Tell me about yourself.",
        "What are your strengths?",
        "What are your weaknesses?",
        "Why should we hire you?",
        "Where do you see yourself in 5 years?"
    ]
};

let currentQuestion = 0;
let userAnswers = [];
let timeLeft = 60;
let timer;

const subject = localStorage.getItem("selectedSubject");
const selectedQuestions = questions[subject] || [];
// Load Interview Page
window.onload = function () {

    const subjectName = document.getElementById("subjectName");
    const questionText = document.getElementById("questionText");
    const questionTitle = document.getElementById("questionTitle");
    const progressText = document.getElementById("progressText");
    const progressBar = document.getElementById("progressBar");

    if (subjectName) {
        subjectName.innerText = subject + " Interview";
    }

    if (selectedQuestions.length > 0) {

        if (questionText) {
            questionText.innerText = selectedQuestions[0];
        }

        if (questionTitle) {
            questionTitle.innerText = "Question 1";
        }

        if (progressText) {
            progressText.innerText = "Question 1 of " + selectedQuestions.length;
        }

        if (progressBar) {
            progressBar.style.width = "20%";
        }
    }

    if (document.getElementById("timer")) {
        startTimer();
    }
};
// Next Question
const nextButton = document.getElementById("nextQuestion");

if (nextButton) {

    nextButton.addEventListener("click", () => {
       
        const answer = document.getElementById("answer").value.trim();

let questionScore = 0;

if (answer.length >= 50) {
    questionScore = 5;
} else if (answer.length >= 35) {
    questionScore = 4;
} else if (answer.length >= 20) {
    questionScore = 3;
} else if (answer.length >= 10) {
    questionScore = 2;
} else {
    questionScore = 0;
}
console.log("Answer:",answer);
    console.log("Question Score:",questionScore);

userAnswers.push({
    question: selectedQuestions[currentQuestion],
    answer: answer,
    score: questionScore
});

document.getElementById("answer").value = "";

        currentQuestion++;
        console.log(userAnswers);

        if (currentQuestion < selectedQuestions.length) {

            document.getElementById("questionText").innerText =
                selectedQuestions[currentQuestion];

            document.getElementById("questionTitle").innerText =
                "Question " + (currentQuestion + 1);

            document.getElementById("progressText").innerText =
                "Question " + (currentQuestion + 1) +
                " of " + selectedQuestions.length;

            document.getElementById("progressBar").style.width =
                ((currentQuestion + 1) / selectedQuestions.length) * 100 + "%";

            startTimer();

        } else {

            alert("You have completed the interview!");

            window.location.href = "result.html";

        }

    });

}
// Finish Interview
const finishButton = document.getElementById("submitAnswer");

if (finishButton) {

    finishButton.addEventListener("click", async () => {
        const confirmFinish = confirm(
            "Are you sure you want to finish the interview?"
        );
        if(!confirmFinish){
            return;
        }

        const answer = document.getElementById("answer").value.trim();

        if (answer === "") {
            alert("Please type your answer before finishing.");
            return;
        }

        let questionScore = 0;

        if (answer.length >= 50) {
            questionScore = 5;
        } else if (answer.length >= 35) {
            questionScore = 4;
        } else if (answer.length >= 20) {
            questionScore = 3;
        } else if (answer.length >= 10) {
            questionScore = 2;
        } else {
            questionScore = 0;
        }

if (answer === "") {
    alert("Please type your answer before finishing.");
    return;
}

userAnswers.push({
    question: selectedQuestions[currentQuestion],
    answer: answer,
    score: questionScore
});
let totalScore = 0;
userAnswers.forEach(item =>{
    totalScore += item.score;
});
let score = Math.round(totalScore/
    selectedQuestions.length);
   
        const interviewData = {
    role: subject,
    overallScore: Number(score),
    questions: userAnswers.map(item =>({
        question: item.question,
        answer: item.answer,
        score: item.score,
        feedback: ""
    }))
};

try {
    const aiResponse = await fetch("/api/ai-feedback", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        question: selectedQuestions[currentQuestion],
        answer: answer
    })
});

const aiResult = await aiResponse.json();
const aiScore = Math.min(5,Math.max(0,
    Number(aiResult.score) || 0));
userAnswers[userAnswers.length -1].score = aiScore;
totalScore = 0;

userAnswers.forEach(item =>{
    totalScore += item.score;
});
score = Math.round(totalScore/ userAnswers.length);
    interviewData.overallScore = score;
interviewData.questions[userAnswers.length -1].feedback = aiResult.feedback;

    const response = await fetch("/api/interviews/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(interviewData)
    });

    const result = await response.json();

    console.log(result);
    console.log("Score being saved:",score);

    localStorage.setItem("interviewScore", score);
    localStorage.setItem("aiFeedback",aiResult.feedback);

    alert("Interview Completed Successfully");
    window.location.href = "result.html";

} catch (error) {

    console.log(error);
    alert("Interview could not be saved.");

}

    });

}
// Result Page
const scoreElement = document.getElementById("score");
const feedbackElement = document.getElementById("feedback");
const ratingElement = document.getElementById("rating");

if (scoreElement && feedbackElement) {

    const score = Number(localStorage.getItem("interviewScore")) || 0;

    scoreElement.innerText = score + " / 5";
    const badge = document.querySelector(".performance-badge");

if (score == 5) {
    badge.innerText = "🏆 Excellent Performance";
    badge.style.background = "linear-gradient(90deg,#28a745,#20c997)";
}
else if (score >= 3) {
    badge.innerText = "🥈 Good Performance";
    badge.style.background = "linear-gradient(90deg,#007bff,#00b4d8)";
}
else {
    badge.innerText = "📚 Keep Practicing";
    badge.style.background = "linear-gradient(90deg,#ff9800,#ff5722)";
}

    let feedback = "";

    if (score === 5) {
        feedback = "Excellent! Outstanding performance.";
    } else if (score >= 4) {
        feedback = "Very Good! Keep practicing.";
    } else if (score >= 3) {
        feedback = "Good effort. Improve your explanations.";
    } else if (score >= 2) {
        feedback = "Practice more technical questions.";
    } else {
        feedback = "Keep learning and practicing. You can do it!";
    }

    feedbackElement.innerText = feedback;
    if (ratingElement) {

    if (score == 5) {
        ratingElement.innerText = "⭐⭐⭐⭐⭐ Outstanding";
    }
    else if (score == 4) {
        ratingElement.innerText = "⭐⭐⭐⭐ Very Good";
    }
    else if (score == 3) {
        ratingElement.innerText = "⭐⭐⭐ Good";
    }
    else if (score == 2) {
        ratingElement.innerText = "⭐⭐ Needs Improvement";
    }
    else {
        ratingElement.innerText = "⭐ Beginner";
    }

}
}
function startTimer() {

    clearInterval(timer);

    timeLeft = 60;

    const timerElement = document.getElementById("timer");

    if (timerElement) {
        timerElement.innerText = "Time Left: " + timeLeft + " sec";
    }

    timer = setInterval(() => {

        timeLeft--;

        if (timerElement) {
            timerElement.innerText = "Time Left: " + timeLeft + " sec";
        }

        if (timeLeft <= 0) {

            clearInterval(timer);

            alert("⏰ Time is up!");

            const nextButton = document.getElementById("nextQuestion");

            if (nextButton) {
                nextButton.click();
            }

        }

    }, 1000);
}
// Performance Summary
const summary = document.getElementById("summary");

if (summary) {

    const score = Number(localStorage.getItem("interviewScore")) || 0;

    let points = [];

    if (score >= 4) {
        points = [
            "Strong understanding of concepts.",
            "Good interview preparation level."
        ];
    } else if (score >= 2) {
        points = [
            "Good attempt. Practice more technical questions.",
            "Improve your explanations."
        ];
    } else {
        points = [
            "Revise the basics.",
            "Take more mock interviews."
        ];
    }

    points.forEach(point => {
        const li = document.createElement("li");
        li.innerText = point;
        summary.appendChild(li);
    });
}
// Interview History
const historyTable = document.getElementById("historyTable");

if (historyTable) {

    fetch("/api/interviews/history")
        .then(response => response.json())
        .then(interviews => {
            console.log("History Data:",interviews);
            document.getElementById("totalInterviews").innerText = interviews.length;

    let totalScore = 0;
    let highestScore = 0;
    // ===== Chart =====
const labels = [];
const scores = [];

interviews.forEach(interview => {
    labels.push(interview.role);
    scores.push(interview.overallScore);
});

const chartCanvas = document.getElementById("scoreChart");

if (chartCanvas) {
    new Chart(chartCanvas, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Interview Score",
                data: scores,
                borderWidth: 3,
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });
}
// ===== Subject-wise Performance =====

let subjectScores = {
    Python: 0,
    Java: 0,
    SQL: 0,
    "Data Science": 0,
    HR: 0
};
interviews.forEach(interview => {
    subjectScores[interview.role] = interview.overallScore;
});

document.getElementById("pythonScore").innerText = subjectScores["Python"];
document.getElementById("javaScore").innerText = subjectScores["Java"];
document.getElementById("sqlScore").innerText = subjectScores["SQL"];
document.getElementById("datascienceScore").innerText = subjectScores["Data Science"];
document.getElementById("hrScore").innerText = subjectScores["HR"];

    interviews.forEach(interview => {
        totalScore += interview.overallScore;

        if (interview.overallScore > highestScore) {
            highestScore = interview.overallScore;
        }
    });

    const averageScore =
        interviews.length > 0
            ? (totalScore / interviews.length).toFixed(1)
            : 0;

    document.getElementById("averageScore").innerText = averageScore;
    // ===== Placement Readiness =====

const readiness = Math.min(100,
    (Number(averageScore)/5)*100);

const progressFill = document.getElementById("progressFill");
const readinessPercent = document.getElementById("readinessPercent");
const readinessMessage = document.getElementById("readinessMessage");

if (progressFill && readinessPercent && readinessMessage) {

    progressFill.style.width = readiness + "%";
    readinessPercent.innerText = Math.round(readiness) + "%";

    if (readiness >= 80) {
        readinessMessage.innerText = "🟢 Excellent! You are placement ready.";
    }
    else if (readiness >= 60) {
        readinessMessage.innerText = "🟡 Good! Keep practicing to improve.";
    }
    else {
        readinessMessage.innerText = "🔴 Practice more before attending interviews.";
    }
}
    document.getElementById("highestScore").innerText = highestScore;

    if (interviews.length > 0) {
        document.getElementById("latestInterview").innerText =
            interviews[0].role;
    }

            interviews.forEach(interview => {

                const row = document.createElement("tr");
                const status =
    interview.overallScore >= 4
        ? "🟢 Excellent"
        : interview.overallScore >= 2
        ? "🟡 Needs Practice"
        : "🔴 Beginner";

                row.innerHTML = `
                    <td>${interview.role}</td>
                    <td>${interview.overallScore}/5</td>
                    <td>${status}</td>
                    <td>${new Date(interview.createdAt).toLocaleDateString()}</td>
                `;

                historyTable.appendChild(row);

            });

        })
        .catch(error => {
            console.log(error);
        });

}

// Download PDF Report
const downloadButton = document.getElementById("downloadReport");

if (downloadButton) {

    downloadButton.addEventListener("click", () => {

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF();

        const role = localStorage.getItem("selectedSubject") || "N/A";
        const score = localStorage.getItem("interviewScore") || "0";
        const date = new Date().toLocaleDateString();

        const feedback =
            Number(score) >= 4
                ? "Excellent Performance"
                : Number(score) >= 2
                ? "Good Performance"
                : "Needs More Practice";

        doc.setFontSize(20);
        doc.text("AI Interview Preparation System", 20, 20);

        doc.setFontSize(14);
        doc.text("Interview Report", 20, 35);

        doc.text("Candidate: Surya Kanikelli", 20, 50);
        doc.text("Role: " + role, 20, 65);
        doc.text("Score: " + score + "/5", 20, 80);
        doc.text("Feedback: " + feedback, 20, 95);
        doc.text("Date: " + date, 20, 110);

        doc.save("Interview_Report.pdf");

    });

}
// AI Feedback
const aiFeedback = document.getElementById("aiFeedback");
const realFeedback = localStorage.getItem("aiFeedback");
if (aiFeedback&& realFeedback){
    aiFeedback.innerHTML ="";
    const li = document.createElement("li");
    li.innerText = realFeedback;
    aiFeedback.appendChild(li);
}

if (aiFeedback) {

    const score = Number(localStorage.getItem("interviewScore")) || 0;

    let feedback = [];

    if (score >= 5) {
        feedback = [
            "🌟 Excellent performance in the interview.",
            "✅ Strong technical knowledge.",
            "💡 Your answers were clear and confident.",
            "🚀 You are ready for placement interviews."
        ];
    }
    else if (score >= 3) {
        feedback = [
            "👍 Good performance.",
            "📚 Revise a few technical concepts.",
            "💬 Try giving more detailed answers.",
            "🎯 Practice more mock interviews."
        ];
    }
    else {
        feedback = [
            "📖 Learn the basic concepts first.",
            "💻 Practice coding every day.",
            "🎤 Improve your communication skills.",
            "🔥 Keep practicing—you'll improve!"
        ];
    }

    feedback.forEach(point => {
        const li = document.createElement("li");
        li.innerText = point;
        aiFeedback.appendChild(li);
    });

}
// Certificate Page
const certificateRole = document.getElementById("certificateRole");
const certificateScore = document.getElementById("certificateScore");

if (certificateRole && certificateScore) {

    const role = localStorage.getItem("selectedSubject") || "N/A";
    const score = localStorage.getItem("interviewScore") || "0";

    certificateRole.innerText = "Interview Role: " + role;
    certificateScore.innerText = "Final Score: " + score + " / 5";

}
// Download Certificate
const downloadCertificate = document.getElementById("downloadCertificate");

if (downloadCertificate) {

    downloadCertificate.addEventListener("click", () => {

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF("landscape");

        const role = localStorage.getItem("selectedSubject") || "N/A";
        const score = localStorage.getItem("interviewScore") || "0";
        const date = new Date().toLocaleDateString();

        doc.setFontSize(28);
        doc.text("Certificate of Achievement", 105, 30, { align: "center" });

        doc.setFontSize(18);
        doc.text("AI Interview Preparation System", 105, 45, { align: "center" });

        doc.setFontSize(16);
        doc.text("This certificate is proudly presented to", 105, 70, { align: "center" });

        doc.setFontSize(24);
        doc.text("Surya Kanikelli", 105, 90, { align: "center" });

        doc.setFontSize(16);
        doc.text("For successfully completing the AI Mock Interview", 105, 110, { align: "center" });

        doc.text("Interview Role: " + role, 105, 130, { align: "center" });
        doc.text("Final Score: " + score + " / 5", 105, 145, { align: "center" });
        doc.text("Date: " + date, 105, 160, { align: "center" });

        doc.save("AI_Interview_Certificate.pdf");

    });

}
// Dark Mode
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.innerText = "☀️ Light Mode";
    }

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            themeToggle.innerText = "☀️ Light Mode";
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.innerText = "🌙 Dark Mode";
        }

    });

}
// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("selectedSubject");
        localStorage.removeItem("interviewScore");
        localStorage.removeItem("aiFeedback");

        alert("Logged out successfully!");

        window.location.href = "login.html";
    });
}