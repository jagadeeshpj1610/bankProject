import React, { useState } from 'react';

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { email, password };
    try {
      const response = await fetch('http://localhost:8000/api/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Signup successful!`);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('Network error, please try again later.');
    }
  };

  return (
    <div>
      <h2>Admin Signup</h2>
      <form>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        <button type="submit" onClick={handleSubmit}>Sign Up</button>
      </form>

      {message && (
        <div>
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminSignup;
