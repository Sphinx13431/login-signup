import React, { useState } from 'react';
import './Quiz.css'; // Assuming you have a separate CSS file for the quiz

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const data = [
    {
      question: "Does the child struggle to learn the alphabet or recognize letters?",
      option1: "YES",
      option2: "NO",
      ans: 1,
    },
    {
      question: "Is it difficult to pronounce unfamiliar words?",
      option1: "YES",
      option2: "NO",
      ans: 1,
    },
    {
      question: "Does the child have difficulty rhyming words (e.g., cat, hat, bat)",
      option1: "YES",
      option2: "NO",
      ans: 1,
    },
    {
      question: " Does the child frequently guess words instead of reading them?",
      option1: "YES",
      option2: "NO",
      ans: 1,
    },
    {
      question: "Does the child have trouble sounding out words when reading?",
      option1: "YES",
      option2: "NO",
      ans: 1,
    },
  ];

  const handleAnswerOptionClick = (selectedAnswer) => {
    if (selectedAnswer === data[currentQuestion].ans) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < data.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="container">
      {showScore ? (
        <div className="score-section">
          You scored {score} out of {data.length}
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{data.length}
            </div>
            <div className="question-text">{data[currentQuestion].question}</div>
          </div>
          <div className="answer-section">
            <button onClick={() => handleAnswerOptionClick(1)}>{data[currentQuestion].option1}</button>
            <button onClick={() => handleAnswerOptionClick(2)}>{data[currentQuestion].option2}</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;