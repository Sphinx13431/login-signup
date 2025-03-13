import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

// Add this helper function at the top of the file, after the imports
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const Quiz = () => {
  const [showStudentForm, setShowStudentForm] = useState(true); // New state
  const [studentInfo, setStudentInfo] = useState({ // New state
    studentName: '',
    age: '',
    grade: ''
  });
  const [showRules1, setShowRules1] = useState(false);
  const [showRules2, setShowRules2] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const navigate = useNavigate();

  const parentQuestions = [
    // Section 2: Early Childhood Development
    {
      question: "Did the individual have delayed speech development (e.g., first words after 18 months)?",
      section: "Early Childhood Development"
    },
    {
      question: "Were there difficulties learning nursery rhymes or songs?",
      section: "Early Childhood Development"
    },
    {
      question: "Did they struggle with recognizing letters, numbers, or colors at an early age?",
      section: "Early Childhood Development"
    },
    {
      question: "Did they have trouble remembering sequences (e.g., days of the week, the alphabet)?",
      section: "Early Childhood Development"
    },
    // Section 3: Reading Skills
    {
      question: "Does the individual confuse similar-looking letters (e.g., 'b' and 'd', 'p' and 'q')?",
      section: "Reading Skills"
    },
    {
      question: "Do they have difficulty sounding out unfamiliar words?",
      section: "Reading Skills"
    },
    {
      question: "Do they skip or substitute words when reading aloud?",
      section: "Reading Skills"
    },
    {
      question: "Do they read significantly slower than peers?",
      section: "Reading Skills"
    },
    {
      question: "Do they struggle with reading comprehension (understanding what they read)?",
      section: "Reading Skills"
    },
    // Section 4: Writing and Spelling Skills
    {
      question: "Does the individual have poor spelling, often spelling the same word differently in the same document?",
      section: "Writing and Spelling Skills"
    },
    {
      question: "Do they struggle with organizing thoughts in writing?",
      section: "Writing and Spelling Skills"
    },
    {
      question: "Do they frequently make letter reversals in writing (e.g., 'was' instead of 'saw') beyond early childhood?",
      section: "Writing and Spelling Skills"
    },
    {
      question: "Do they have difficulty copying text accurately from a board or book?",
      section: "Writing and Spelling Skills"
    },
    // Section 5: Memory and Processing
    {
      question: "Do they have trouble remembering instructions or sequences?",
      section: "Memory and Processing"
    },
    {
      question: "Do they struggle with recalling names, dates, or facts?",
      section: "Memory and Processing"
    },
    {
      question: "Do they have difficulty with left and right directions?",
      section: "Memory and Processing"
    },
    {
      question: "Do they often misplace or forget items (e.g., homework, keys)?",
      section: "Memory and Processing"
    },
    // Section 6: Math and Numbers
    {
      question: "Do they struggle with remembering multiplication tables or basic arithmetic facts?",
      section: "Math and Numbers"
    },
    {
      question: "Do they have difficulty understanding word problems in math?",
      section: "Math and Numbers"
    },
    {
      question: "Do they confuse mathematical symbols (e.g., +, -, x, ÷)?",
      section: "Math and Numbers"
    },
    // Section 7: Attention and Emotional Impact
    {
      question: "Do they experience frustration or anxiety related to reading and writing?",
      section: "Attention and Emotional Impact"
    },
    {
      question: "Do they avoid reading aloud or writing assignments?",
      section: "Attention and Emotional Impact"
    },
    {
      question: "Do they show signs of low self-esteem due to academic struggles?",
      section: "Attention and Emotional Impact"
    }
  ];

  const handleStudentInfoSubmit = (e) => {
    e.preventDefault();
    setShowStudentForm(false);
    setShowRules1(true);
  };

  const handleRules1Next = () => {
    setShowRules1(false);
    setShowRules2(true);
  };

  const handleRules2Next = () => {
    setShowRules2(false);
  };

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < parentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // If it's the last question, calculate score immediately
      calculateScore(newAnswers);
    }
  };

  const calculateScore = async (finalAnswers) => {
    const yesCount = Object.values(finalAnswers).filter(answer => answer === 'YES').length;

    try {
        // Update baseURL to match new API structure
        const baseURL = 'http://localhost:8000/api';
        
        console.log('Fetching CSRF token...');
        const tokenResponse = await fetch(`${baseURL}/csrf-token/`, {
            credentials: 'include'
        });
        
        if (!tokenResponse.ok) {
            console.error('Token response status:', tokenResponse.status);
            throw new Error(`Failed to get CSRF token: ${tokenResponse.status}`);
        }
        
        const tokenData = await tokenResponse.json();
        console.log('Token received:', tokenData);
        const csrfToken = tokenData.csrfToken;

        console.log('Sending assessment data...');
        const response = await fetch(`${baseURL}/save-student-assessment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify({
                studentName: studentInfo.studentName,
                age: parseInt(studentInfo.age),
                grade: studentInfo.grade,
                yesCount: yesCount
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', errorText);
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Assessment saved successfully:', data);
        setShowScore(true);
        localStorage.setItem('parentQuizCompleted', 'true');
        localStorage.setItem('parentQuizScore', yesCount.toString());

    } catch (error) {
        console.error('Error details:', error);
        alert(`Error saving assessment: ${error.message}`);
    }
};

  if (showStudentForm) {
    return (
      <div className="quiz-wrapper">
        <div className="form-container">
          <h2>Student Information</h2>
          <form onSubmit={handleStudentInfoSubmit}>
            <div className="form-group">
              <label>Student's Name:</label>
              <input
                type="text"
                required
                value={studentInfo.studentName}
                onChange={(e) => setStudentInfo({
                  ...studentInfo,
                  studentName: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                required
                value={studentInfo.age}
                onChange={(e) => setStudentInfo({
                  ...studentInfo,
                  age: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Grade/Class:</label>
              <input
                type="text"
                required
                value={studentInfo.grade}
                onChange={(e) => setStudentInfo({
                  ...studentInfo,
                  grade: e.target.value
                })}
              />
            </div>
            <button type="submit">Start Assessment</button>
          </form>
        </div>
      </div>
    );
  }

  if (showRules1) {
    return (
      <div className="quiz-wrapper">
        <div className="rules-container">
          <h2>Dyslexia Screening Questionnaire</h2>
          <p>For Parents, Teachers, or Self-Assessment for Older Individuals</p>
          <p>This questionnaire helps identify potential signs of dyslexia. It is not a diagnostic tool but can indicate whether further assessment by a specialist is necessary.</p>
          <button onClick={handleRules1Next}>Next</button>
        </div>
      </div>
    );
  }

  if (showRules2) {
    return (
      <div className="quiz-wrapper">
        <div className="rules-container">
          <h2>Scoring & Interpretation</h2>
          <ul>
            <li>0-5 "Yes" responses → Likely typical learning variation</li>
            <li>6-10 "Yes" responses → Possible mild difficulties</li>
            <li>11-15 "Yes" responses → Moderate risk of dyslexia</li>
            <li>16+ "Yes" responses → High risk of dyslexia</li>
          </ul>
          <button onClick={handleRules2Next}>Start Assessment</button>
        </div>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="quiz-wrapper">
        <div className="score-container">
          <h2>Parent Assessment Complete</h2>
          <p>Number of "Yes" responses: {Object.values(answers).filter(a => a === 'YES').length}</p>
          <button onClick={() => navigate('/student-quiz')}>Start Student Assessment</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        <div className="question-section">
          <h3>{parentQuestions[currentQuestion].section}</h3>
          <p>{parentQuestions[currentQuestion].question}</p>
        </div>
        <div className="answer-section">
          <button onClick={() => handleAnswer('YES')}>YES</button>
          <button onClick={() => handleAnswer('NO')}>NO</button>
        </div>
        <div className="progress">
          Question {currentQuestion + 1} of {parentQuestions.length}
        </div>
      </div>
    </div>
  );
};

export default Quiz;