import React, { useEffect } from 'react';
import './Home.css';
// import video from './assets/video.mp4';
import image1 from './assets/bg1.png';
import image2 from './assets/bg2.png';
import image3 from './assets/bg3.png';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/', { replace: true });
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <div className='nav'>
      <div className='nav logo'></div>
      <ul className='nav-menu'>
        <li className='nav-logout'><button onClick={handleLogout}>Log Out</button></li>
        <li className='nav-test'><Link to="/testpage">Test</Link></li>
      </ul>
    </div>
  );
};

const Background = () => {
  return <img src={require("./assets/bg2.png")} className='background' alt='Background' />;
};

const Hero = ({ heroCount, setHeroCount, setPlayStatus, playStatus }) => {
  useEffect(() => {
    const videoElement = document.getElementById('video');
    if (videoElement && playStatus) {
      videoElement.addEventListener('ended', () => setPlayStatus(false));
    }
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', () => setPlayStatus(false));
      }
    };
  }, [playStatus, setPlayStatus]);

  return (
    
    <div className='hero'>
      {!playStatus && (
        <div className='hero-text'>
          <h2>Dyslexia & Dyscalculia: Understanding Learning Differences</h2>
          <p><strong>Dyslexia</strong> is a learning difference that affects reading, writing, and spelling. Individuals with dyslexia may struggle with letter recognition, decoding words, and reading fluency, despite having normal intelligence.</p>
          <p><strong>Dyscalculia</strong> impacts numerical understanding and math skills. People with dyscalculia may have difficulty with number sense, calculations, and problem-solving involving mathematical concepts.</p>
          <p>Both are neurological conditions, not a lack of effort or intelligence. With the right support, individuals can thrive in their learning journeys.</p>
        </div>
      )}
    {/* //   <div className="hero-dot-play"></div>
    //   {playStatus && (
    //     // <video id="video" className="hero-video" autoPlay>
    //     //   <source src={video} type="video/mp4" />
    //     //   Your browser does not support the video tag.
    //     // </video>
    //   )} */}
    </div>
  );
};

const Home = ({ heroCount, setHeroCount, setPlayStatus, playStatus }) => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="background-container">
        <Background playStatus={playStatus} heroCount={heroCount} />
        <Hero 
          heroCount={heroCount} 
          setHeroCount={setHeroCount} 
          setPlayStatus={setPlayStatus} 
          playStatus={playStatus} 
        />
      </div>
    </div>
  );
};

export default Home;