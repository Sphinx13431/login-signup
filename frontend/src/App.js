import React, { useState } from 'react';
import Login from './Login';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Signup from './Signup';
import Home from './Home';
import Quiz from './Quiz'; // Corrected import statement
import TestPage from './TestPage';
import StudentQuiz from './StudentQuiz';

function App() {
  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);

  // const heroData = {
  //   text1: "Welcome to the Homepage!",
  //   text2: "Enjoy exploring the features."
  // };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route 
          path='/home' 
          element={
            <Home 
              heroCount={heroCount} 
              // heroData={heroData} 
              setHeroCount={setHeroCount} 
              setPlayStatus={setPlayStatus} 
              playStatus={playStatus} 
            />
          } 
        />
        <Route path='/quiz' element={<Quiz />} />
        <Route path='/testpage' element={<TestPage />} /> 
        <Route path='/student-quiz' element={
          <ProtectedRoute>
            <StudentQuiz />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

// Protected route component to ensure parent quiz is completed
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isParentQuizCompleted = localStorage.getItem('parentQuizCompleted') === 'true';

  React.useEffect(() => {
    if (!isParentQuizCompleted) {
      navigate('/quiz');
    }
  }, [navigate]);

  return isParentQuizCompleted ? children : null;
};

export default App;
