// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../css/CreateAccount.css';

// const CreateAccount = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     dob: '',
//     balance: '',
//     email: '',
//     aadhaar: '',
//     phone: '',
//     address: '',
//     accountType: 'Savings',
//   });
//   const [message, setMessage] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [result, setResult] = useState("");
//   const [showPreview, setShowPreview] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };


//   const validateName = () => {
//     return formData.name !== '';
//   };


//   const validateDob = () => {
//     let dob = new Date(formData.dob);
//     let today = new Date();
//     let age = today.getFullYear() - dob.getFullYear();
//     let monthDifference = today.getMonth() - dob.getMonth();
//     if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
//       age--;
//     }

//     return age >= 18;
//   };


//   const validateBalance = () => {
//     return !isNaN(formData.balance) && parseFloat(formData.balance) > 0;
//   };

//   const validateEmail = () => {
//     const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
//     return emailPattern.test(formData.email);
//   };

//   const validateAadhaar = () => {
//     return /^\d{12}$/.test(formData.aadhaar);
//   };

//   const validatePhone = () => {
//     return /^\d{10}$/.test(formData.phone);
//   };

//   const validateAddress = () => {
//     return formData.address !== '';
//   };

//   const validateForm = () => {
//     if (!validateName()) {
//       setMessage("Name is required.");
//       setSuccess(false);
//       return false;
//     }

//     if (!validateBalance()) {
//       setMessage("Balance must be a valid number greater than 0.");
//       setSuccess(false);
//       return false;
//     }
//     if (!validateEmail()) {
//       setMessage("Please enter a valid Gmail address.");
//       setSuccess(false);
//       return false;
//     }
//     if (!validateAadhaar()) {
//       setMessage("Aadhaar number must be exactly 12 digits.");
//       setSuccess(false);
//       return false;
//     }
//     if (!validatePhone()) {
//       setMessage("Phone number must be exactly 10 digits.");
//       setSuccess(false);
//       return false;
//     }
//     if (!validateAddress()) {
//       setMessage("Address is required.");
//       setSuccess(false);
//       return false;
//     }

//     if (!validateDob()) {
//       setMessage("You must atlest 18 years old  only");
//       setSuccess(false);
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setShowPreview(true);
//   };

//   const confirmSubmission = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setMessage("You are not authenticated. Please log in.");
//       setSuccess(false);
//       return;
//     }

//     try {
//       //fetch('http://localhost:8000/api/admin/account/create'
//       //fetch('https://magadhabackend.onrender.com/api/admin/account/create'
//       const response = await fetch('https://magadhabackend.onrender.com/api/admin/account/create', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       setResult(data);

//       if (response.ok) {
//         setMessage('Account created successfully! Your Account Number: ' + data.accountNumber);
//         setSuccess(true);
//         setShowPreview(false);
//         setFormData({
//           name: '',
//           dob: '',
//           balance: '',
//           email: '',
//           aadhaar: '',
//           phone: '',
//           address: '',
//           accountType: 'Savings',
//         });
//         setResult("");

//         setTimeout(() => {
//           setMessage("");
//           navigate('/home/adminhome')
//         }, 7000);
//       } else {
//         setMessage(data.message);
//         setSuccess(false);
//       }
//     } catch (error) {
//       setMessage('Error: ' + error.message);
//       setSuccess(false);
//     }
//   };

//   return (
//     <div className='container'>

//       <h2 className="create-account-title">Create New Account</h2>

//       {message &&
//         <p className={`create-account-message ${success ? 'success' : 'error'}`}>{message}</p>
//       }

//       <form className="create-account-form" onSubmit={handleSubmit}>
//         <label className="create-account-label">Name:</label>
//         <input className="create-account-input" type="text" name="name" value={formData.name} onChange={handleChange} required />

//         <label className="create-account-label">Date of Birth:</label>
//         <input className="create-account-input" type="date" name="dob" value={formData.dob} onChange={handleChange} required />

//         <label className="create-account-label">Initial Balance:</label>
//         <input className="create-account-input" type="number" name="balance" value={formData.balance} onChange={handleChange} required />

//         <label className="create-account-label">Email:</label>
//         <input className="create-account-input" type="email" name="email" value={formData.email} onChange={handleChange} required />

//         <label className="create-account-label">Aadhaar Number:</label>
//         <input className="create-account-input" type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} required />

//         <label className="create-account-label">Phone Number:</label>
//         <input className="create-account-input" type="text" name="phone" value={formData.phone} onChange={handleChange} required />

//         <label className="create-account-label">Address:</label>
//         <textarea className="create-account-textarea" name="address" value={formData.address} onChange={handleChange} required />

//         <label className="create-account-label">Account Type:</label>
//         <select className="create-account-select" name="accountType" value={formData.accountType} onChange={handleChange} required>
//           <option value="Savings">Savings</option>
//           <option value="Current">Current</option>
//         </select>

//         <button className="create-account-button" type="submit">
//           Create Account
//         </button>
//       </form>



//       {showPreview && (
//         <div className="preview-popup">
//           <div className="preview-content">
//             <h3>Confirm Account Details</h3>
//             <table className="preview-table">
//               <tbody>
//                 <tr>
//                   <td><strong>Name:</strong></td>
//                   <td>{formData.name}</td>
//                 </tr>
//                 <tr>
//                   <td><strong>Date of Birth:</strong></td>
//                   <td>{formData.dob}</td>
//                 </tr>
//                 <tr>
//                   <td><strong>Email:</strong></td>
//                   <td>{formData.email}</td>
//                 </tr>
//                 <tr>
//                   <td><strong>Aadhaar:</strong></td>
//                   <td>{formData.aadhaar}</td>
//                 </tr>
//                 <tr>
//                   <td><strong>Phone:</strong></td>
//                   <td>{formData.phone}</td>
//                 </tr>
//                 <tr>
//                   <td><strong>Address:</strong></td>
//                   <td>{formData.address}</td>
//                 </tr>
//                 <tr>
//                   <td><strong>Account Type:</strong></td>
//                   <td>{formData.accountType}</td>
//                 </tr>
//                 <tr>
//                   <td><strong>Initial Balance:</strong></td>
//                   <td>₹{formData.balance}</td>
//                 </tr>
//               </tbody>
//             </table>
//             <div className="preview-buttons">
//               <button className="confirm-button" onClick={confirmSubmission}>Confirm</button>
//               <button className="cancel-button" onClick={() => setShowPreview(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateAccount;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CreateAccount.css';

const CreateAccount = () => {
  const navigate = useNavigate();
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
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateName = () => formData.name !== '';

  const validateDob = () => {
    const dob = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const validateBalance = () => !isNaN(formData.balance) && parseFloat(formData.balance) > 0;

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailPattern.test(formData.email);
  };

  const validateAadhaar = () => /^\d{12}$/.test(formData.aadhaar);

  const validatePhone = () => /^\d{10}$/.test(formData.phone);

  const validateAddress = () => formData.address !== '';

  const validateForm = () => {
    if (!validateName()) {
      setMessage("Name is required.");
      setSuccess(false);
      return false;
    }
    if (!validateBalance()) {
      setMessage("Balance must be a valid number greater than 0.");
      setSuccess(false);
      return false;
    }
    if (!validateEmail()) {
      setMessage("Please enter a valid Gmail address.");
      setSuccess(false);
      return false;
    }
    if (!validateAadhaar()) {
      setMessage("Aadhaar number must be exactly 12 digits.");
      setSuccess(false);
      return false;
    }
    if (!validatePhone()) {
      setMessage("Phone number must be exactly 10 digits.");
      setSuccess(false);
      return false;
    }
    if (!validateAddress()) {
      setMessage("Address is required.");
      setSuccess(false);
      return false;
    }
    if (!validateDob()) {
      setMessage("You must be at least 18 years old.");
      setSuccess(false);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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
      const response = await fetch('https://magadhabackend.onrender.com/api/admin/account/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
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
          navigate('/home/adminhome')
        }, 7000);
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

      {message && <p className={`create-account-message ${success ? 'success' : 'error'}`}>{message}</p>}

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

        <button className="create-account-button" type="submit">Create Account</button>
      </form>

      {showPreview && (
        <div className="preview-popup">
          <div className="preview-content">
            <h3>Confirm Account Details</h3>
            <table className="preview-table">
              <tbody>
                <tr><td><strong>Name:</strong></td><td>{formData.name}</td></tr>
                <tr><td><strong>Date of Birth:</strong></td><td>{formData.dob}</td></tr>
                <tr><td><strong>Email:</strong></td><td>{formData.email}</td></tr>
                <tr><td><strong>Aadhaar:</strong></td><td>{formData.aadhaar}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>{formData.phone}</td></tr>
                <tr><td><strong>Address:</strong></td><td>{formData.address}</td></tr>
                <tr><td><strong>Account Type:</strong></td><td>{formData.accountType}</td></tr>
                <tr><td><strong>Initial Balance:</strong></td><td>₹{formData.balance}</td></tr>
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

