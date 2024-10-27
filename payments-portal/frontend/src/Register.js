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
    const passwordRegex = /[A-Za-z\d_]{8,}/; // Uses \d instead of [0-9]
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain letters and numbers.');
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
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setError(''), 5000); // Clear error message after 5 seconds
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
