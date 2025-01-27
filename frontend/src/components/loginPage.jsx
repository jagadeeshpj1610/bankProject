import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/index.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        console.log(user);

        localStorage.setItem('token', user.token);
        localStorage.setItem('role', user.user.role);
        localStorage.setItem('email', email);

        if (user.user.role === 'admin') {
          navigate('/home/adminHome');
        } else {
          navigate('/userHome');
        }
      } else {
        setMsg('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setMsg('An error occurred, please try again later.');
    }
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <h2 className="loginHeading">Login</h2>
        {msg && <p className="errorMessage">{msg}</p>}
        <form onSubmit={handleLogin} className="loginForm">
          <input
            type="email"
            className="loginInput"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            className="loginInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="loginButton">Login</button>
          <div className="signupLink">
            <Link to="/usersignup">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
