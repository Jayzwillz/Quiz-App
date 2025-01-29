const API_URL = "https://opentdb.com/api.php?amount=5&category=18&type=multiple";
let quizData = [];
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const resultContainer = document.getElementById("result");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart-btn");
const quizContainer = document.getElementById("quiz");

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
        resultContainer.style.display = "none"; // Ensure result section is hidden
        quizContainer.style.display = "block"; // Show the quiz
        loadQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function loadQuestion() {
    resetState();
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
}

function resetState() {
    optionsElement.innerHTML = "";
    nextButton.classList.remove("active");
    nextButton.disabled = true;
}

function selectAnswer(button, isCorrect) {
    document.querySelectorAll(".option-btn").forEach(btn => btn.disabled = true);
    
    if (isCorrect) {
        score++;
        button.classList.add("correct");
    } else {
        button.classList.add("wrong");
    }

    nextButton.classList.add("active");
    nextButton.disabled = false;
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++; 
        loadQuestion(); 
    } else {
        showResult(); // ✅ Ensure results show at the last question
    }
});

function showResult() {
    quizContainer.style.display = "none"; // ✅ Hide quiz
    resultContainer.style.display = "block"; // ✅ Show result
    scoreElement.textContent = `You scored ${score} out of ${quizData.length}! 🎉`;
}

restartButton.addEventListener("click", fetchQuestions);

fetchQuestions();
