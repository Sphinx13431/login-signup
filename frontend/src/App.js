import React, { useState } from 'react';
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Home from './Home';
import Quiz from './Quiz'; // Corrected import statement

function App() {
  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);

  const heroData = {
    text1: "Welcome to the Homepage!",
    text2: "Enjoy exploring the features."
  };

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
              heroData={heroData} 
              setHeroCount={setHeroCount} 
              setPlayStatus={setPlayStatus} 
              playStatus={playStatus} 
            />
          } 
        />
        <Route path='/quiz' element={<Quiz />} /> {/* Added Quiz route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;