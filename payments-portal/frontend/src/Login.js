import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password,
      });
      console.log('Login successful:', response.data);  // Log the response from the backend
      alert('Login successful!');
    } catch (err) {
      if (err.response) {
        // Handle backend errors (e.g., incorrect credentials)
        console.error('Error response:', err.response.data);  // Log detailed error message from backend
        setError(err.response.data.message || 'Login failed. Please check your username and password.');
      } else {
        // Handle network or other general errors
        console.error('Error:', err);
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
