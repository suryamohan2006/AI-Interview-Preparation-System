console.log("dashboard.js loaded");
fetch("/api/interviews/summary")
  .then(response => response.json())
  .then(data => {
    console.log("Summary Data:", data);

    const total = document.getElementById("totalInterviews");
    const avg = document.getElementById("averageScore");
    const high = document.getElementById("highestScore");

    const summaryTotal = document.getElementById("summaryTotalInterviews");
    const summaryAvg = document.getElementById("summaryAverageScore");
    const summaryBest = document.getElementById("summaryBestScore");

    if (total) total.innerText = data.totalInterviews;
    if (avg) avg.innerText = data.averageScore;
    if (high) high.innerText = data.bestScore;

    if (summaryTotal) summaryTotal.innerText = data.totalInterviews;
    if (summaryAvg) summaryAvg.innerText = data.averageScore + " / 5";
    if (summaryBest) summaryBest.innerText = data.bestScore + " / 5";

    const ctx = document.getElementById("scoreChart");

    if (ctx) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Average Score", "Best Score"],
          datasets: [{
            label: "Score (Out of 5)",
            data: [data.averageScore, data.bestScore],
            backgroundColor: ["#36a2eb", "#4caf50"],
            borderColor: ["#1e88e5", "#388e3c"],
            borderWidth: 2,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: "Interview Performance"
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 5
            }
          }
        }
      });
    }
  })
  .catch(error => {
    console.log(error);
  });
  function startInterview(subject){
    console.log("Starting interview:",subject);
    localStorage.setItem("selectedSubject",subject);
    window.location.href = "interview.html";
  }