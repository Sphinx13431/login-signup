import React from 'react';
import './Home.css';
import video from './assets/video.mp4';
import image1 from './assets/bg1.png';
import image2 from './assets/bg2.png';
import image3 from './assets/bg3.png';
import play_icon from './assets/play_icon.png';
import pause_icon from './assets/pause_icon.png';
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
      <div className='nav logo'>ML-test</div>
      <ul className='nav-menu'>
        <li className='nav-home'><Link to="/home">Home</Link></li>
        <li className='nav-profile'><Link to="/Profile">Profile</Link></li>
        <li className='nav-logout'><button onClick={handleLogout}>Log Out</button></li>
        <li className='nav-test'><Link to="/testpage">Test</Link></li>
      </ul>
    </div>
  );
};

const Background = ({ playStatus, heroCount }) => {
  if (playStatus) {
    return (
      <video className='background' autoPlay loop muted>
        <source src={video} type='video/mp4' />
      </video>
    );
  } else if (heroCount === 0) {
    return <img src={image1} className='background' alt='' />;
  } else if (heroCount === 1) {
    return <img src={image2} className='background' alt='' />;
  } else if (heroCount === 2) {
    return <img src={image3} className='background' alt='' />;
  }
};

const Hero = ({ heroCount, heroData, setHeroCount, setPlayStatus, playStatus }) => {
  return (
    <div className='hero'>
      <div className='hero-text'>
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>
      <div className="hero-explore">
        <p>Explore the features</p>
        
      </div>
      <div className="hero-dot-play"></div>
      <ul className="hero-dots">
        <li onClick={() => setHeroCount(0)} className={heroCount === 0 ? "hero-dot orange" : "hero-dot"}></li>
        <li onClick={() => setHeroCount(1)} className={heroCount === 1 ? "hero-dot orange" : "hero-dot"}></li>
        <li onClick={() => setHeroCount(2)} className={heroCount === 2 ? "hero-dot orange" : "hero-dot"}></li>
      </ul>
      <div className="hero-play">
        <img 
          onClick={() => setPlayStatus(!playStatus)} 
          src={playStatus ? pause_icon : play_icon} 
          alt=''
        />
        <p>See the video</p>
      </div>
    </div>
  );
};

const Home = ({ heroCount, heroData, setHeroCount, setPlayStatus, playStatus }) => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="background-container">
        <Background playStatus={playStatus} heroCount={heroCount} />
        <Hero 
          heroCount={heroCount} 
          heroData={heroData} 
          setHeroCount={setHeroCount} 
          setPlayStatus={setPlayStatus} 
          playStatus={playStatus} 
        />
      </div>
    </div>
  );
};

export default Home;
