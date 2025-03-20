import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validation from './LoginValidation';
import './Login.css'; // Import the CSS file

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validation(values);
    setErrors(validationErrors);

    if (!validationErrors.email && !validationErrors.password) {
      try {
        // First get CSRF token
        const tokenResponse = await fetch('http://localhost:8000/api/csrf-token/', {
          credentials: 'include'
        });
        
        if (!tokenResponse.ok) {
          throw new Error('Failed to get CSRF token');
        }

        const { csrfToken } = await tokenResponse.json();
        
        const response = await fetch('http://localhost:8000/api/login/', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          body: JSON.stringify(values)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          throw new Error('Login failed');
        }

        const data = await response.json();
        if (data.status === 'Success') {
          navigate('/home');
        } else {
          alert(data.message || "Invalid credentials");
        }
      } catch (err) {
        console.error('Login error:', err);
        alert(err.message || "Login failed");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Sign-in</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleInput}
              className="form-control"
              autoComplete="off"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={handleInput}
              className="form-control"
              autoComplete="off"
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <button type="submit" className="btn-login">
            <strong>Login</strong>
          </button>
          <p>You are agreed to our terms and conditions</p>
          <Link to="/signup" className="btn-create-account">
            <strong>Create Account</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;