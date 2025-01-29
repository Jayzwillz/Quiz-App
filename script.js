const API_URL = "https://opentdb.com/api.php?amount=5&category=18&type=multiple";
let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const resultContainer = document.getElementById("result");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart-btn");
const quizContainer = document.getElementById("quiz");
const progressBar = document.querySelector(".progress");
const timerElement = document.getElementById("timer");
const darkModeButton = document.getElementById("dark-mode-toggle");

async function fetchQuestions() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        quizData = data.results.map(q => ({
            question: q.question,
            options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
            answer: q.correct_answer
        }));
        currentQuestionIndex = 0;
        score = 0;
        resultContainer.style.display = "none";
        quizContainer.style.display = "block";
        loadQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function loadQuestion() {
    resetState();
    startTimer();
    let currentQuestion = quizData[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;

    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option-btn");
        button.onclick = () => selectAnswer(button, option === currentQuestion.answer);
        optionsElement.appendChild(button);
    });

    nextButton.classList.remove("active");
    nextButton.disabled = true;

    progressBar.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;
}

function resetState() {
    optionsElement.innerHTML = "";
    nextButton.classList.remove("active");
    nextButton.disabled = true;
    clearInterval(timerInterval);
    timeLeft = 30;
    timerElement.textContent = timeLeft;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    let correctAnswer = quizData[currentQuestionIndex].answer;
    document.querySelectorAll(".option-btn").forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add("correct"); // Highlight correct answer
        } else {
            btn.classList.add("wrong"); // Mark other options as incorrect
        }
    });

    // Move to the next question automatically after 2 seconds
    setTimeout(() => {
        if (currentQuestionIndex < quizData.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            showResult();
        }
    }, 2000);
}

function selectAnswer(button, isCorrect) {
    document.querySelectorAll(".option-btn").forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === quizData[currentQuestionIndex].answer) {
            btn.classList.add("correct");
        }
    });

    if (isCorrect) {
        score++;
        button.classList.add("correct");
    } else {
        button.classList.add("wrong");
    }

    clearInterval(timerInterval);
    nextButton.classList.add("active");
    nextButton.disabled = false;
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";
    scoreElement.textContent = `You scored ${score} out of ${quizData.length}! 🎉`;
}

restartButton.addEventListener("click", fetchQuestions);
darkModeButton.addEventListener("click", () => document.body.classList.toggle("dark-mode"));

fetchQuestions();
