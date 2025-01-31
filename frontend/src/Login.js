import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validation from './LoginValidation';

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
    setErrors(validation(values));
    if (errors.email === "" && errors.password === "") {
      try {
        // First get CSRF token
        const tokenResponse = await fetch('http://localhost:8000/api/csrf-token/', {
          credentials: 'include',
        });
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
        const data = await response.json();
        if (data.status === 'Success') {
          navigate('/home');
        } else {
          alert("Invalid credentials");
        }
      } catch (err) {
        console.error('Login failed:', err);
        alert("Login failed");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Sign-in</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleInput}
              className="form-control rounded-0"
              autoComplete='off'
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={handleInput}
              className="form-control rounded-0"
              autoComplete='off'
            />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100 rounded-0 mb-3"
          >
            <strong>Login</strong>
          </button>
          <p>You are agreed to our terms and conditions</p>
          <Link
            to="/signup"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            <strong>Create Account</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
