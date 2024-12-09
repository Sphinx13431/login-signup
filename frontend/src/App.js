import React, { useState } from 'react';
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Corrected import
import Signup from './Signup';
import Home from './Home';


function App() {
  return (
    <BrowserRouter>  {/* Corrected BrowserRouter */}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </BrowserRouter> 
  );
}

export default App;
