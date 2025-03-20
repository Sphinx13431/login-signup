import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';
import starImage from './images/Star.jpg';
import squareImage from './images/Square.png';
import parallelogramImage from './images/Parallelogram.jpg';
import rectangleImage from './images/Rectangle.jpg';
import diamondImage from './images/Diamond.jpg';

const StudentQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [sectionScores, setSectionScores] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  // Define all questions with sections and correct answers
  const questions = [
    // Section 1: Phonological awareness
    {
      question: "Do these words rhyme? Hat & Bat",
      options: ["Yes", "No"],
      correctAnswer: "Yes",
      section: "Phonological Awareness",
      type: "mcq"
    },
    {
      question: "Do these words rhyme? House & Mouse",
      options: ["Yes", "No"],
      correctAnswer: "Yes",
      section: "Phonological Awareness",
      type: "mcq"
    },
    {
      question: "Do these words rhyme? Dog & Car",
      options: ["Yes", "No"],
      correctAnswer: "No",
      section: "Phonological Awareness",
      type: "mcq"
    },
    {
      question: "What word do you get if you remove the first sound from the word cat? ",
      options: ["cat", "ct", "at", "ca"],
      correctAnswer: "at",
      section: "Phonological Awareness",
      type: "mcq"
    },
    {
      question: "Which word rhymes with the word ball",
      options: ["tall", "tale", "cole", "pale"],
      correctAnswer: "tall",
      section: "Phonological Awareness",
      type: "mcq"
    },
    {
      question: "What is the first sound in the word sun?",
      options: ["s", "o", "u", "n"],
      correctAnswer: "s",
      section: "Phonological Awareness",
      type: "mcq"
    },
    {
      question: "Which word rhymes with the word ball",
      options: ["tall", "tale", "cole", "pale"],
      correctAnswer: "tall",
      section: "Phonological Awareness",
      type: "mcq"
    },
    {
      question: "Write frog backwards?",
      options: ["gorf", "rogf", "gfor", "grof"],
      correctAnswer: "gorf",
      section: "Phonological Awareness",
      type: "mcq"
    },
    
    // Section 2: Vocabulary Understanding
    {
      question: "What is the opposite of 'hot'?",
      options: ["Cold", "Wet", "Dry", "Warm"],
      correctAnswer: "Cold",
      section: "Vocabulary Understanding",
      type: "mcq"
    },
    {
      question: "What is another word for 'happy'?",
      options: ["Joyful", "Sad", "Angry", "Tired"],
      correctAnswer: "Joyful",
      section: "Vocabulary Understanding",
      type: "mcq"
    },
    {
      question: "Which of these objects is a type of fruit?",
      options: ["Chair", "Apple", "Car"],
      correctAnswer: "Apple",
      section: "Vocabulary Understanding",
      type: "mcq"
    },
    {
      question: "Can you find the word 'fish' in this list?",
      options: ["dog", "sun", "fish", "car", "rain"],
      correctAnswer: "fish",
      section: "Vocabulary Understanding",
      type: "mcq"
    },
    {
      question: "Which of these words is the longest?",
      options: ["car", "elephant", "bat"],
      correctAnswer: "elephant",
      section: "Vocabulary Understanding",
      type: "mcq"
    },

    // Section 3: Sentence Comprehension
    {
      question: "Which sentence makes sense?",
      options: ["The dog flew in the sky", "The dog ran in the park"],
      correctAnswer: "The dog ran in the park",
      section: "Sentence Comprehension",
      type: "mcq"
    },
    {
      question: "Are these sentences the same? 'The cat chased the mouse' and 'The mouse chased the cat'",
      options: ["Yes", "No"],
      correctAnswer: "No",
      section: "Sentence Comprehension",
      type: "mcq"
    },
    {
      question: "Complete this sentence: At night, the sky is ___",
      options: ["dark", "sunny", "orange", "white"],
      correctAnswer: "dark",
      section: "Sentence Comprehension",
      type: "mcq"
    },

    // Section 4: Logical Reasoning
    {
      question: "What comes next in the pattern: Red, Blue, Red, Blue, ___?",
      options: ["Yellow", "Red", "Green", "Blue"],
      correctAnswer: "Red",
      section: "Logical Reasoning",
      type: "mcq"
    },
    {
      question: "What comes next in this sequence: Apple, banana, apple, banana, ___?",
      options: ["Orange", "Apple", "Grape", "Banana"],
      correctAnswer: "Apple",
      section: "Logical Reasoning",
      type: "mcq"
    },
    {
      question: "Why do we wear a coat in winter?",
      options: ["To stay warm", "To look nice", "To get wet", "To carry things"],
      correctAnswer: "To stay warm",
      section: "Logical Reasoning",
      type: "mcq"
    },
    {
      question: "What should you do if you spill water on the floor?",
      options: ["Clean it up", "Walk away", "Play in it", "Do nothing"],
      correctAnswer: "Clean it up",
      section: "Logical Reasoning",
      type: "mcq"
    },
    {
      question: "What should you say if you bump into someone?",
      options: ["Say Sorry", "Watch where you are going","Do nothing"],
      correctAnswer: "Say Sorry",
      section: "Logical Reasoning",
      type: "mcq"
    },
    {
      question: "If you are hungry, what should you do? ",
      options: ["Eat something", "Do nothing"],
      correctAnswer: "Eat something",
      section: "Logical Reasoning",
      type: "mcq"
    },

    // Section 5: Reading Comprehension
    {
      question: "Sara lost her teddy bear. She looked under her bed, but it wasn't there. Then she checked the sofa and found it. Where was the teddy bear?",
      options: ["Under the bed", "On the sofa", "In the closet", "In the garden"],
      correctAnswer: "On the sofa",
      section: "Reading Comprehension",
      type: "mcq"
    },
    {
      question: "The boy ate an apple. What did he eat?",
      options: ["Orange", "Apple", "Banana", "Pear"],
      correctAnswer: "Apple",
      section: "Reading Comprehension",
      type: "mcq"
    },
    {
      question: "The cat climbed the tree because it was scared. Why did the cat climb?",
      options: ["The cat was brave", "The cat was scared", "The cat loves to jump"],
      correctAnswer: "The cat was scared",
      section: "Reading Comprehension",
      type: "mcq"
    },
    {
      question: "John’s shoes were too small, so he bought a bigger size. Why did John buy new shoes?",
      options: ["His shoes were large", "His shoes were too small", "His shoes worn out", "His shoes were dirty"],
      correctAnswer: "His shoes were too small",
      section: "Reading Comprehension",
      type: "mcq"
    },
    {
      question: "Sally bought five apples. She gave two to her friend. How many does she have left?",
      options: ["Five", "Zero", "Two", "Three"],
      correctAnswer: "Three",
      section: "Reading Comprehension",
      type: "mcq"
    },
    {
      question: "Tom forgot his umbrella. What might happen if it rains?",
      options: ["He will be warm", "He will get wet", "He will dance in the rain"],
      correctAnswer: "He will get wet",
      section: "Reading Comprehension",
      type: "mcq"
    },
    
    // Add Section 6: Handwriting
    {
      question: "Copy the following paragraph in your best handwriting and upload a clear image of it:",
      paragraphText: "The little brown dog ran across the garden to chase a red ball. The wind blew softly, and the leaves danced in the air. Suddenly, a cat jumped onto the fence, watching the dog with curious eyes. The dog barked happily, wagging its tail, and the cat quickly disappeared behind the bushes.",
      section: "Handwriting",
      type: "handwriting-upload"
    },

    // Section 7: Number Sense and Recognition
    {
      question: "What number comes after 7?",
      options: ["6", "7", "8", "9"],
      correctAnswer: "8",
      section: "Number Sense",
      type: "mcq"
    },
    {
      question: "What number comes before 12?",
      options: ["10", "11", "12", "13"],
      correctAnswer: "11",
      section: "Number Sense",
      type: "mcq"
    },
    {
      question: "Select the biggest number.",
      options: ["10", "9", "12", "7"],
      correctAnswer: "12",
      section: "Number Sense",
      type: "mcq"
    },
    {
      question:"If you have 3 apples and I give you 2 more, how many do you have? (Expected: 5)",
      options: ["4", "5", "6", "7"],
      correctAnswer: "5",
      section: "Number Sense",
      type: "mcq"
    },

    // Section 8: Basic Arithmetic
    {
      question: "What is 2 + 3?",
      options: ["4", "5", "6", "7"],
      correctAnswer: "5",
      section: "Basic Arithmetic",
      type: "mcq"
    },
    {
      question: "What is 6 - 2?",
      options: ["2", "3", "4", "5"],
      correctAnswer: "4",
      section: "Basic Arithmetic",
      type: "mcq"
    },
    {
      question: "What is double of 4",
      options: ["8", "12", "4", "6"],
      correctAnswer: "8",
      section: "Basic Arithmetic",
      type: "mcq"
    },
    {
      question: "What is half of 10?",
      options: ["2", "3", "4", "5"],
      correctAnswer: "5",
      section: "Basic Arithmetic",
      type: "mcq"
    },
    {
      question: " If you have 10 candies and give away 4, how many are left?",
      options: ["4", "5", "6", "7"],
      correctAnswer: "6",
      section: "Basic Arithmetic",
      type: "mcq"
    },

    // Section 9: Number Sequencing and Patterns
    {
      question: "Fill in the missing number: 2, 4, __, 8, 10",
      options: ["5", "6", "7", "9"],
      correctAnswer: "6",
      section: "Number Sequencing",
      type: "mcq"
    },
    {
      question: "What comes next: 5, 10, 15, __?",
      options: ["16", "18", "20", "25"],
      correctAnswer: "20",
      section: "Number Sequencing",
      type: "mcq"
    },
    {
      question: "What is the missing number: 3,__,9,12?",
      options: ["6", "8", "5", "7"],
      correctAnswer: "6",
      section: "Number Sequencing",
      type: "mcq"
    },
    {
      question: " Arrange these numbers in order from smallest to largest: 5,2,8,1",
      options: ["1,2,5,8", "1,5,2,8", "5,1,2,8", "2,1,5,8"],
      correctAnswer: "1,2,5,8",
      section: "Number Sequencing",
      type: "mcq"
    },
    // Section 10: Spatial Awareness & Number Alignment
    {
      question:"Select the number three.(3,E,8)",
      options: ["3", "E", "8", "None"],
      correctAnswer: "3",
      section: "Spatial Awareness",
      type: "mcq"
    },
    {
      question:"Select the number six (6,9,P)",
      options: ["6", "9", "P", "None"],
      correctAnswer: "6",
      section: "Spatial Awareness",
      type: "mcq"
    },
    {
      question: "Can you match the number of objects to the correct numeral?",
      image: starImage,
      options: ["3", "4", "5", "6"],
      correctAnswer: "5",
      section: "Spatial Awareness",
      type: "image-question"
    },
    {
      question: "Select the square.",
      options: [
        { id: "Square", image: squareImage },
        { id: "Parallelogram", image: parallelogramImage },
        { id: "Rectangle", image: rectangleImage},
        { id: "Diamond", image: diamondImage }
      ],
      correctAnswer: "Square",
      section: "Spatial Awareness",
      type: "image-options"
    },

    // Section 11: Memory & Math-Related Language
    {
      question: "What number is between 3 and 5?",
      options: ["2", "3", "4", "6"],
      correctAnswer: "4",
      section: "Memory & Math",
      type: "mcq"
    },
    {
      question: "If today is Monday, what day is tomorrow?",
      options: ["Sunday", "Monday", "Tuesday", "Wednesday"],
      correctAnswer: "Tuesday",
      section: "Memory & Math",
      type: "mcq"
    },
    {
      question: "Which is more: 3 dimes or 2 quarters?",
      options: ["3 dimes", "2 quarters", "They are equal", "Can't tell"],
      correctAnswer: "2 quarters",
      section: "Memory & Math",
      type: "mcq"
    },
    {
      question:"If a pizza is cut into 4 pieces and you eat 2, how much is left?",
      options: ["1", "2", "3", "4"],
      correctAnswer: "2",
      section: "Memory & Math",
      type: "mcq"
    }
  ];

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateSectionScores(newAnswers);
      setShowScore(true);
    }
  };

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleHandwritingSubmission = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const tokenResponse = await fetch('http://localhost:8000/api/csrf-token/', {
        credentials: 'include'
      });
      const { csrfToken } = await tokenResponse.json();

      const response = await fetch('http://localhost:8000/api/save-handwriting/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        // Move to next question after successful upload
        setCurrentQuestion(currentQuestion + 1);
        setSelectedImage(null);
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const calculateSectionScores = (finalAnswers) => {
    // Initialize section trackers - remove Handwriting section
    const sectionTrackers = {
        'Phonological Awareness': { correct: 0, total: 0 },
        'Vocabulary Understanding': { correct: 0, total: 0 },
        'Sentence Comprehension': { correct: 0, total: 0 },
        'Logical Reasoning': { correct: 0, total: 0 },
        'Reading Comprehension': { correct: 0, total: 0 },
        'Number Sense': { correct: 0, total: 0 },
        'Basic Arithmetic': { correct: 0, total: 0 },
        'Number Sequencing': { correct: 0, total: 0 },
        'Spatial Awareness': { correct: 0, total: 0 },
        'Memory & Math': { correct: 0, total: 0 }
    };

    // Calculate scores for each section, skip handwriting section
    questions.forEach((q, index) => {
        // Skip if the section is Handwriting
        if (q.section !== "Handwriting" && sectionTrackers[q.section]) {
            sectionTrackers[q.section].total += 1;
            if (finalAnswers[index] === q.correctAnswer) {
                sectionTrackers[q.section].correct += 1;
            }
        }
    });

    // Calculate percentages
    const percentages = {};
    Object.entries(sectionTrackers).forEach(([section, scores]) => {
        percentages[section] = (scores.correct / scores.total) * 100;
    });

    // Send to backend
    sendScoresToBackend(percentages);
    setSectionScores(sectionTrackers);
};

const sendScoresToBackend = async (percentages) => {
    try {
        // First get CSRF token
        const tokenResponse = await fetch('http://localhost:8000/api/csrf-token/', {
            credentials: 'include'
        });
        
        if (!tokenResponse.ok) {
            throw new Error('Failed to get CSRF token');
        }

        const { csrfToken } = await tokenResponse.json();
        
        const response = await fetch('http://localhost:8000/api/save-assessment-scores/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify({
                section1_percentage: percentages['Phonological Awareness'],
                section2_percentage: percentages['Vocabulary Understanding'],
                section3_percentage: percentages['Sentence Comprehension'],
                section4_percentage: percentages['Logical Reasoning'],
                section5_percentage: percentages['Reading Comprehension'],
                section7_percentage: percentages['Number Sense'],
                section8_percentage: percentages['Basic Arithmetic'],
                section9_percentage: percentages['Number Sequencing'],
                section10_percentage: percentages['Spatial Awareness'],
                section11_percentage: percentages['Memory & Math']
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Literacy Scores:', data.literacy_scores);
        console.log('Numeracy Scores:', data.numeracy_scores);
        // Store the prediction result in sectionScores
        setSectionScores(prev => ({
            ...prev,
            prediction_result: data.prediction_result
        }));

    } catch (error) {
        console.error('Error saving scores:', error);
    }
};

  if (showScore) {
    return (
      <div className="score-container">
        <h2>Assessment Complete</h2>
        
        <div className="diagnosis-result">
          <h3>Result</h3>
          <div className="diagnosis-text">
            {sectionScores.prediction_result ? (
              <div>
                {sectionScores.prediction_result.split(' ').map((condition, index) => (
                  <div key={index} className="condition-result">
                    <p>{condition}</p>
                    <a 
                      href={`/guidelines/${condition.toLowerCase()}.docx`} 
                      download
                      className="download-link"
                      onClick={(e) => {
                        // Check if file exists
                        fetch(`/guidelines/${condition.toLowerCase()}.docx`)
                          .then(response => {
                            if (!response.ok) {
                              e.preventDefault();
                              alert('Guidelines file not available');
                            }
                          });
                      }}
                    >
                      Download {condition} Guidelines
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p>No learning difficulties detected</p>
            )}
          </div>
        </div>

        <div className="scores-grid">
          {Object.entries(sectionScores).map(([section, score]) => (
            // Only show scores for non-handwriting sections
            section !== "Handwriting" && section !== "prediction_result" &&(
              <div key={section} className="section-score">
                <h3>{section}</h3>
                <p>Score: {score.correct}/{score.total}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(score.correct/score.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )
          ))}
        </div>
        <button onClick={() => navigate('/home')}>Back to Home</button>
      </div>
    );
  }

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'handwriting-upload':
        return (
          <div className="handwriting-container">
            <div className="paragraph-to-copy">
              <p>{question.paragraphText}</p>
            </div>
            <div className="upload-section">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              {selectedImage && (
                <div className="image-preview">
                  <img src={URL.createObjectURL(selectedImage)} alt="Handwriting preview" />
                </div>
              )}
              <button 
                className="submit-button"
                onClick={() => handleHandwritingSubmission()}
                disabled={!selectedImage}
              >
                Submit Handwriting
              </button>
            </div>
          </div>
        );

      case 'image-question':
        return (
          <div className="question-container">
            <img 
              src={question.image} 
              alt="Question" 
              className="question-image"
            />
            <div className="options-container">
              {question.options.map((option, index) => (
                <button 
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="option-button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'image-options':
        return (
          <div className="image-options-container">
            {question.options.map((option, index) => (
              <div key={index} className="image-option">
                <img 
                  src={option.image} 
                  alt={option.text}
                  onClick={() => handleAnswer(option.text)}
                  className="option-image"
                />
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="options-container">
            {question.options.map((option, index) => (
              <button 
                key={index}
                onClick={() => handleAnswer(option)}
                className="option-button"
              >
                {option}
              </button>
            ))}
          </div>
        );
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        <div className="section-header">
          <h3>{currentQ.section}</h3>
          <p>Question {currentQuestion + 1} of {questions.length}</p>
        </div>
        <div className="question">
          <p>{currentQ.question}</p>
          {renderQuestion(currentQ)}
        </div>
      </div>
    </div>
  );
};

export default StudentQuiz;
