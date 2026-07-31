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
        "What is the difference between DELETE and TRUNCATE?",
        "What is a primary key?",
        "What is a foreign key?",
        "What is a JOIN?"
    ],

    "Data Science": [
        "What is Data Science?",
        "What is Machine Learning?",
        "Explain supervised learning.",
        "What is overfitting?",
        "What is Pandas?"
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
let timeLeft = 60;
let timer;
const subject =
localStorage.getItem("selectedSubject");
const selectedQuestions = questions[subject] || [];
window.onload = function(){
    const subjectName =
    document.getElementById("subjectName");
    const questionText =
    document.getElementById("questionText");
    if(subjectName){
      subjectName.innerText = subject+"interview";
}
if(questionText$$ selectedQuestions.length> 0){
    questionsText.innerText = selectedQuestions[0];
}
startTimer();
};
// Show subject and first question
window.onload = function () {

    const subjectHeading = document.getElementById("subjectName");

    if (subjectHeading) {
        const subject = localStorage.getItem("selectedSubject");

        subjectHeading.innerText =
            subject ? subject + " Interview" : "AI Interview";
    }


    const subject = localStorage.getItem("selectedSubject");
    const selectedQuestions = questions[subject] || [];


    const questionText = document.getElementById("questionText");

    if (questionText && selectedQuestions.length > 0) {

        questionText.innerText =
            selectedQuestions[currentQuestion];

        startTimer();
    }
};


// Next Question
const nextButton = document.getElementById("nextQuestion");

if (nextButton) {

    nextButton.addEventListener("click", () => {


        const subject = localStorage.getItem("selectedSubject");
        const selectedQuestions = questions[subject] || [];


        currentQuestion++;


        if (currentQuestion < selectedQuestions.length) {
            if(progressText)
                progressText.innerText =
            "Question"+(currentQuestion+1)+ "of"+ selectedQuestions.length;
            const progressBar =
            document.getElementById("progressBar");
            if(progressBar){
                progressBar.style.width=
                ((currentQuestion +1)/selectedQuestions.length)*100 + "%";
            }

            const questionText =
            document.getElementById("questionText");

            const questionTitle =
            document.getElementById("questionTitle");

            const progressText =
            document.getElementById("progressText");


            if(questionText)
                questionText.innerText =
                selectedQuestions[currentQuestion];


            if(questionTitle)
                questionTitle.innerText =
                "Question " + (currentQuestion + 1);


            if(progressText)
                progressText.innerText =
                "Question " + (currentQuestion + 1)
                + " of " + selectedQuestions.length;


            startTimer();


        } else {

            alert("You have completed the interview!");

            localStorage.setItem(
                "interviewScore",
                0
            );

            window.location.href="result.html";
        }

    });
}


// Finish Interview - Save Data

const finishButton =
document.getElementById("submitAnswer");


if(finishButton){

    finishButton.addEventListener("click", async()=>{


        const answer =
        document.querySelector("textarea").value.trim();


        if(answer===""){

            alert("Please answer before finishing.");
            return;

        }


        let score;


        if(answer.length > 50)
            score = 5;
        else if(answer.length > 30)
            score = 4;
        else if(answer.length > 15)
            score = 3;
        else if(answer.length > 5)
            score = 2;
        else
            score = 1;



        const interviewData = {

            role:
            localStorage.getItem("selectedSubject"),


            questions:[
                {
                    question:
                    document.getElementById("questionText").innerText,

                    answer:answer,

                    feedback:
                    "Answer evaluated successfully",

                    score:score
                }
            ],


            overallScore:score
        };



        try{


            const response =
            await fetch("/api/interviews/create",{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:
                JSON.stringify(interviewData)

            });



            const result =
            await response.json();


            console.log(result);


            localStorage.setItem(
                "interviewScore",
                score
            );


            window.location.href="result.html";



        }catch(error){

            console.log(error);

        }


    });

}


// Timer

function startTimer(){


    clearInterval(timer);

    timeLeft=60;


    const timerElement =
    document.getElementById("timer");


    timer=setInterval(()=>{


        timeLeft--;


        if(timerElement){

            timerElement.innerText =
            "Time Left: " + timeLeft + " sec";

        }


        if(timeLeft<=0){

            clearInterval(timer);

            alert("Time is up!");


            const next =
            document.getElementById("nextQuestion");


            if(next)
                next.click();

        }


    },1000);

}



// Result Page

const scoreElement =
document.getElementById("score");


const feedbackElement =
document.getElementById("feedback");



if(scoreElement && feedbackElement){


    const score =
    localStorage.getItem("interviewScore") || 0;


    scoreElement.innerText =
    score + " / 5";


    if(score>=4)

        feedbackElement.innerText =
        "Excellent! You performed very well.";

    else if(score>=3)

        feedbackElement.innerText =
        "Good job! Keep practicing.";

    else

        feedbackElement.innerText =
        "Keep practicing and improve your concepts.";

}



// Performance Summary

const summary =
document.getElementById("summary");


if(summary){


    const points=[

        "Practice more technical questions.",

        "Improve explanation skills."

    ];



    points.forEach(point=>{


        const li =
        document.createElement("li");


        li.innerText=point;


        summary.appendChild(li);


    });

}



// History Page

const historyTable =
document.getElementById("historyTable");


if(historyTable){


fetch("/api/interviews/history")

.then(res=>res.json())

.then(data=>{


data.forEach(interview=>{


const row =
document.createElement("tr");


row.innerHTML=`

<td>${interview.role}</td>

<td>${interview.overallScore}/5</td>

<td>${new Date(interview.createdAt)
.toLocaleDateString()}</td>

`;


historyTable.appendChild(row);


});


})

.catch(error=>console.log(error));


}