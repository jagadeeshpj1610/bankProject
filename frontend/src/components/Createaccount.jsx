import React, { useState } from 'react';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    balance: '',
    email: '',
    pan: '',
    aadhaar: '',
    phone: '',
    address: '',
    accountType: 'Savings', // Default to "Savings"
  });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.dob ||
      !formData.balance ||
      !formData.email ||
      !formData.pan ||
      !formData.aadhaar ||
      !formData.phone ||
      !formData.address ||
      !formData.accountType
    ) {
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
      <h2>Create New Account</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Date of Birth:</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

        <label>Initial Balance:</label>
        <input type="number" name="balance" value={formData.balance} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>PAN Number:</label>
        <input type="text" name="pan" value={formData.pan} onChange={handleChange} required />

        <label>Aadhaar Number:</label>
        <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} required />

        <label>Phone Number:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Address:</label>
        <textarea name="address" value={formData.address} onChange={handleChange} required />

        <label>Account Type:</label>
        <select name="accountType" value={formData.accountType} onChange={handleChange} required>
          <option value="Savings">Savings</option>
          <option value="Current">Current</option>
        </select>

        <button type="submit" style={{ backgroundColor: 'black', color: 'white' }}>
          Create Account
        </button>
      </form>
      {message && <p style={{ color: success ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default CreateAccount;
