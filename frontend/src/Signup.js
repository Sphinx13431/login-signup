import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validation from './SignupValidation';


function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validation(values);
    setErrors(validationErrors);
    
    // Check if there are any validation errors
    if(Object.keys(validationErrors).every(key => !validationErrors[key])) {
      try {
        const tokenResponse = await fetch('http://localhost:8000/api/csrf-token/', {
          credentials: 'include'
        });
        
        if (!tokenResponse.ok) {
          throw new Error('Failed to get CSRF token');
        }

        const { csrfToken } = await tokenResponse.json();
        
        const response = await fetch('http://localhost:8000/api/signup/', {
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
          throw new Error('Signup failed');
        }

        const data = await response.json();
        if (data.status === 'success') {
          alert('Signup successful!');
          navigate('/');
        } else {
          alert(data.message || 'Signup failed');
        }
      } catch (err) {
        console.error('Signup error:', err);
        alert(err.message || "Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Sign-up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              value={values.name}
              onChange={handleInput}
              className="form-control rounded-0"
              autoComplete='off'
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              value={values.email}
              onChange={handleInput}
              className="form-control rounded-0"
              autoComplete='off'
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={values.password}
              onChange={handleInput}
              className="form-control rounded-0"
              autoComplete='off'
            />
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
          </div>
          <button className="btn btn-success w-100 rounded-0" type="submit">
            <strong>Signup</strong>
          </button>
          <p>You are agreed to our terms and conditions</p>
          <Link
            to="/"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            <strong>Log in</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
