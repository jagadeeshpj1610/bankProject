import React, { useState } from 'react';
import '../css/CreateAccount.css'

const CreateAccount = () => {
  const [formData, setFormData] = useState({ name: '', dob: '', balance: '', email: '', });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.dob || !formData.balance || !formData.email) {
      setMessage('All fields are required.');
      setSuccess(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/admin/account/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setSuccess(true);
      } else {
        setMessage(data.message);
        setSuccess(false);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="create-account">
      <h2 className="form-title">Create New Account</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <label className="form-label">Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />

        <label className="form-label">Date of Birth:</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-input" required />

        <label className="form-label">Initial Balance:</label>
        <input type="number" name="balance" value={formData.balance} onChange={handleChange} className="form-input" required />

        <label className="form-label">Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />

        <button type="submit" className="form-button">Create Account</button>
      </form>
      {message && <p className={`form-message ${success ? 'success' : 'error'}`}>{message}</p>}
    </div>
  );
};

export default CreateAccount;
