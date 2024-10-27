import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Simple validation: Ensure both fields are filled
    if (username.trim() === '' || password.trim() === '') {
      setError('Both username and password are required.');
      return;
    }

    // Password strength validation
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must be at least 8 characters long, contain at least one uppercase letter, and one number.');
      return;
    }

    setIsSubmitting(true);
    setError(''); // Clear any previous error

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, {
        username,
        password,
      });
      alert('User registered successfully! You can now log in.');
      setUsername(''); // Clear the form after successful registration
      setPassword('');
      onRegisterSuccess(); // Switch to login form
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Use the error message from the backend
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
      // Clear error message after 5 seconds
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          disabled={isSubmitting}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

// PropTypes for prop validation
Register.propTypes = {
  onRegisterSuccess: PropTypes.func.isRequired,
};

export default Register;
