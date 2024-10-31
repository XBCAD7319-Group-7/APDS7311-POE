import React, { useState } from 'react';
import axios from 'axios';
import Payments from './Payments'; // Import the Payments component

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', {
        username,
        password,
      });
      alert('User registered successfully! You can now log in.');
      setIsRegistering(false);
      setError('');
    } catch (err) {
      setError('Registration failed. Please try a different username.');
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      setError('');
    } catch (err) {
      setError('Login failed. Please check your username and password.');
      console.error(err);
    }
  };

  if (isLoggedIn) {
    return <Payments />;
  }

  return (
    <div>
      <h1>{isRegistering ? 'Register' : 'Login'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
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
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Already have an account? Login here' : 'Need an account? Register here'}
      </button>
    </div>
  );
}

export default App;
