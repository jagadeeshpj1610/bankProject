import React, { useState } from 'react';
import '../css/createAccount.css';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    balance: '',
    email: '',
    aadhaar: '',
    phone: '',
    address: '',
    accountType: 'Savings',
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
    <div className='container'>
    <div className="create-account-container">
      <h2 className="create-account-title">Create New Account</h2>
      <form className="create-account-form" onSubmit={handleSubmit}>
        <label className="create-account-label">Name:</label>
        <input
          className="create-account-input"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label className="create-account-label">Date of Birth:</label>
        <input
          className="create-account-input"
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />

        <label className="create-account-label">Initial Balance:</label>
        <input
          className="create-account-input"
          type="number"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          required
        />

        <label className="create-account-label">Email:</label>
        <input
          className="create-account-input"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label className="create-account-label">Aadhaar Number:</label>
        <input
          className="create-account-input"
          type="text"
          name="aadhaar"
          value={formData.aadhaar}
          onChange={handleChange}
          required
        />

        <label className="create-account-label">Phone Number:</label>
        <input
          className="create-account-input"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label className="create-account-label">Address:</label>
        <textarea
          className="create-account-textarea"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <label className="create-account-label">Account Type:</label>
        <select
          className="create-account-select"
          name="accountType"
          value={formData.accountType}
          onChange={handleChange}
          required
        >
          <option value="Savings">Savings</option>
          <option value="Current">Current</option>
        </select>

        <button className="create-account-button" type="submit">
          Create Account
        </button>
      </form>
      {message && <p className={`create-account-message ${success ? 'success' : 'error'}`}>{message}</p>}
    </div>
    </div>
  );
};

export default CreateAccount;
