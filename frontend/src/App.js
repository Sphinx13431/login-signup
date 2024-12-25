import React, { useState } from 'react';
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Corrected import
import Signup from './Signup';
import Home from './Home';

function App() {
  // State for heroCount, playStatus, and heroData
  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);

  const heroData = {
    text1: "Welcome to the Homepage!",
    text2: "Enjoy exploring the features."
  };

  return (
    <BrowserRouter>  {/* Corrected BrowserRouter */}
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
      </Routes>
    </BrowserRouter> 
  );
}

export default App; 
