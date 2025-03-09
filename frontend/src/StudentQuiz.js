import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Add this import
import './Quiz.css';

const StudentQuiz = () => {
  const navigate = useNavigate();  // Add this
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);

  // Select random questionnaire on component mount
  useEffect(() => {
    const randomNumber = Math.random();
    setSelectedQuestionnaire(randomNumber < 0.5 ? questionnaire1 : questionnaire2);
  }, []);

  const questionnaire1 = [
    // Phonological Awareness
    {
      type: 'yesno',
      question: "Do these words rhyme: Hat & Bat?",
      section: "Phonological Awareness",
      correctAnswer: "YES"
    },
    {
      type: 'yesno',
      question: "Do these words rhyme: House & Mouse?",
      section: "Phonological Awareness",
      correctAnswer: "YES"
    },
    {
      type: 'yesno',
      question: "Do these words rhyme: Dog & Car?",
      section: "Phonological Awareness",
      correctAnswer: "NO"
    },
    // Vocabulary Understanding
    {
      type: 'mcq',
      question: "What is the opposite of 'hot'?",
      section: "Vocabulary Understanding",
      options: ['Cold', 'Wet', 'Dry', 'Warm'],
      correctAnswer: 'Cold'
    },
    {
      type: 'mcq',
      question: "Which word means the same as 'happy'?",
      section: "Vocabulary Understanding",
      options: ['Sad', 'Joyful', 'Angry', 'Tired'],
      correctAnswer: 'Joyful'
    },
    {
      type: 'mcq',
      question: "Which of these objects is a type of fruit?",
      section: "Vocabulary Understanding",
      options: ['Chair', 'Apple', 'Car'],
      correctAnswer: 'Apple'
    },
    // Sentence Comprehension
    {
      type: 'mcq',
      question: "Which sentence makes sense?",
      section: "Sentence Comprehension",
      options: ['The dog flew in the sky', 'The dog ran in the park'],
      correctAnswer: 'The dog ran in the park'
    },
    {
      type: 'yesno',
      question: "Are these sentences the same? 'The cat chased the mouse' and 'The mouse chased the cat'",
      section: "Sentence Comprehension",
      correctAnswer: "NO"
    },
    // Pattern Recognition
    {
      type: 'mcq',
      question: "What comes next in the pattern: Red, Blue, Red, Blue, ___?",
      section: "Pattern Recognition",
      options: ['Yellow', 'Red', 'Green', 'Blue'],
      correctAnswer: 'Red'
    },
    // Sentence Comprehension - additional questions
    {
      type: 'mcq',
      question: "Complete the sentence: At night, the sky is ___",
      section: "Sentence Comprehension",
      options: ['dark', 'sunny', 'orange', 'white'],
      correctAnswer: 'dark'
    },
    {
      type: 'mcq',
      question: "Sara lost her teddy bear. She looked under her bed, but it wasn't there. Then she checked the sofa and found it. Where was the teddy bear?",
      section: "Story Comprehension",
      options: ['Under the bed', 'On the sofa', 'In the closet', 'In the garden'],
      correctAnswer: 'On the sofa'
    },
    {
      type: 'mcq',
      question: "Why do we wear a coat in winter?",
      section: "Reasoning",
      options: ['To stay warm', 'To look nice', 'To get wet', 'To carry things'],
      correctAnswer: 'To stay warm'
    },
    {
      type: 'mcq',
      question: "What should you do if you spill water on the floor?",
      section: "Reasoning",
      options: ['Clean it up', 'Walk away', 'Play in it', 'Do nothing'],
      correctAnswer: 'Clean it up'
    },
    {
      type: 'mcq',
      question: "What would you say if you accidentally bump into someone?",
      section: "Social Understanding",
      options: ['Sorry', 'Hello', 'Goodbye', 'Thank you'],
      correctAnswer: 'Sorry'
    },
    {
      type: 'mcq',
      question: "If you are hungry, what should you do?",
      section: "Reasoning",
      options: ['Eat food', 'Go to sleep', 'Watch TV', 'Play games'],
      correctAnswer: 'Eat food'
    }
  ];

  const questionnaire2 = [
    // Phonological Awareness
    {
      type: 'mcq',
      question: "Which word rhymes with 'ball'?",
      section: "Phonological Awareness",
      options: ['tall', 'dog', 'run'],
      correctAnswer: 'tall'
    },
    {
      type: 'mcq',
      question: "What is the first sound in 'sun'?",
      section: "Sound Recognition",
      options: ['s', 'u', 'n'],
      correctAnswer: 's'
    },
    // Word Recognition
    {
      type: 'mcq',
      question: "Can you find the word 'fish' in this list?",
      section: "Word Recognition",
      options: ['dog', 'sun', 'fish', 'car', 'rain'],
      correctAnswer: 'fish'
    },
    {
      type: 'mcq',
      question: "Which of these words is the longest?",
      section: "Word Recognition",
      options: ['car', 'elephant', 'bat'],
      correctAnswer: 'elephant'
    },
    // Reading Comprehension
    {
      type: 'mcq',
      question: "The boy ate an apple. What did he eat?",
      section: "Reading Comprehension",
      options: ['Orange', 'Apple', 'Banana'],
      correctAnswer: 'Apple'
    },
    {
      type: 'mcq',
      question: "The cat climbed the tree because it was scared. Why did the cat climb?",
      section: "Reading Comprehension",
      options: ['It was happy', 'It was scared', 'It wanted to play'],
      correctAnswer: 'It was scared'
    },
    // Additional Phonological Awareness
    {
      type: 'mcq',
      question: "What word do you get if you remove the first sound from 'cat'?",
      section: "Phonological Awareness",
      options: ['at', 'ca', 'cat', 'hat'],
      correctAnswer: 'at'
    },
    {
      type: 'mcq',
      question: "Say 'frog' backward. Which is correct?",
      section: "Phonological Awareness",
      options: ['gorf', 'forg', 'grof', 'frog'],
      correctAnswer: 'gorf'
    },
    // Additional Reading Comprehension
    {
      type: 'mcq',
      question: "Sally bought five apples. She gave two to her friend. How many does she have left?",
      section: "Reading Comprehension",
      options: ['Two', 'Three', 'Four', 'Five'],
      correctAnswer: 'Three'
    },
    {
      type: 'mcq',
      question: "John's shoes were too small, so he bought a bigger size. Why did John buy new shoes?",
      section: "Reading Comprehension",
      options: ['His shoes were too small', 'He lost his shoes', 'He likes shopping', 'His shoes were dirty'],
      correctAnswer: 'His shoes were too small'
    },
    {
      type: 'mcq',
      question: "Tom forgot his umbrella. What might happen if it rains?",
      section: "Reasoning",
      options: ['He will get wet', 'He will be happy', 'Nothing will happen', 'He will stay dry'],
      correctAnswer: 'He will get wet'
    },
    {
      type: 'mcq',
      question: "What comes next in this sequence: Apple, banana, apple, banana, ___?",
      section: "Pattern Recognition",
      options: ['Orange', 'Apple', 'Banana', 'Grape'],
      correctAnswer: 'Apple'
    },  
  ];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    if (currentQuestion < selectedQuestionnaire.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
    }
  };

  if (!selectedQuestionnaire) {
    return <div className="quiz-wrapper">Loading...</div>;
  }

  if (showScore) {
    return (
      <div className="quiz-wrapper">
        <div className="score-container">
          <h2>Assessment Complete</h2>
          <p>Your Score: {
            Object.entries(answers).reduce((score, [index, answer]) => {
              return score + (answer === selectedQuestionnaire[index].correctAnswer ? 1 : 0);
            }, 0)
          } out of {selectedQuestionnaire.length}</p>
          <button onClick={() => navigate('/testpage')}>Return to Test Page</button>
        </div>
      </div>
    );
  }

  const currentQ = selectedQuestionnaire[currentQuestion];

  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        <h2>Student Assessment</h2>
        <div className="question-section">
          <h3>{currentQ.section}</h3>
          <p>{currentQ.question}</p>
        </div>
        <div className="answer-section">
          {currentQ.type === 'yesno' ? (
            <>
              <button onClick={() => handleAnswer('YES')}>YES</button>
              <button onClick={() => handleAnswer('NO')}>NO</button>
            </>
          ) : (
            currentQ.options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(option)}>
                {option}
              </button>
            ))
          )}
        </div>
        <div className="progress">
          Question {currentQuestion + 1} of {selectedQuestionnaire.length}
        </div>
      </div>
    </div>
  );
};

export default StudentQuiz;
