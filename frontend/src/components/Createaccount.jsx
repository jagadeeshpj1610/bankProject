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
  const [result, setResult] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const confirmSubmission = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You are not authenticated. Please log in.");
      setSuccess(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/admin/account/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);

      if (response.ok) {
        setMessage('Account created successfully! Your Account Number: ' + data.accountNumber);
        setSuccess(true);
        setShowPreview(false);
        setFormData({
          name: '',
          dob: '',
          balance: '',
          email: '',
          aadhaar: '',
          phone: '',
          address: '',
          accountType: 'Savings',
        });
        setResult("");

        setTimeout(() => {
          setMessage("");
        }, 10000);
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

        <h2 className="create-account-title">Create New Account</h2>
        <form className="create-account-form" onSubmit={handleSubmit}>
          <label className="create-account-label">Name:</label>
          <input className="create-account-input" type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label className="create-account-label">Date of Birth:</label>
          <input className="create-account-input" type="date" name="dob" value={formData.dob} onChange={handleChange} required />

          <label className="create-account-label">Initial Balance:</label>
          <input className="create-account-input" type="number" name="balance" value={formData.balance} onChange={handleChange} required />

          <label className="create-account-label">Email:</label>
          <input className="create-account-input" type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label className="create-account-label">Aadhaar Number:</label>
          <input className="create-account-input" type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} required />

          <label className="create-account-label">Phone Number:</label>
          <input className="create-account-input" type="text" name="phone" value={formData.phone} onChange={handleChange} required />

          <label className="create-account-label">Address:</label>
          <textarea className="create-account-textarea" name="address" value={formData.address} onChange={handleChange} required />

          <label className="create-account-label">Account Type:</label>
          <select className="create-account-select" name="accountType" value={formData.accountType} onChange={handleChange} required>
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
          </select>

          <button className="create-account-button" type="submit">
            Create Account
          </button>
        </form>

        {message &&
        <p className={`create-account-message ${success ? 'success' : 'error'}`}>{message}</p>}


      {showPreview && (
        <div className="preview-popup">
          <div className="preview-content">
            <h3>Confirm Account Details</h3>
            <table className="preview-table">
              <tbody>
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>{formData.name}</td>
                </tr>
                <tr>
                  <td><strong>Date of Birth:</strong></td>
                  <td>{formData.dob}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>{formData.email}</td>
                </tr>
                <tr>
                  <td><strong>Aadhaar:</strong></td>
                  <td>{formData.aadhaar}</td>
                </tr>
                <tr>
                  <td><strong>Phone:</strong></td>
                  <td>{formData.phone}</td>
                </tr>
                <tr>
                  <td><strong>Address:</strong></td>
                  <td>{formData.address}</td>
                </tr>
                <tr>
                  <td><strong>Account Type:</strong></td>
                  <td>{formData.accountType}</td>
                </tr>
                <tr>
                  <td><strong>Initial Balance:</strong></td>
                  <td>₹{formData.balance}</td>
                </tr>
              </tbody>
            </table>
            <div className="preview-buttons">
              <button className="confirm-button" onClick={confirmSubmission}>Confirm</button>
              <button className="cancel-button" onClick={() => setShowPreview(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAccount;

