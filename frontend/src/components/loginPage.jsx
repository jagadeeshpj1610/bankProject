import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const user = await response.json();
      console.log(user);

      navigate("/userhome", { state: { email: email } });
    } else {
      setMsg('Invalid Username or Password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <p>{msg}</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
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
        <Link to='/signup'>Sign Up</Link>
      </form>
    </div>
  );
};

export default LoginPage;
