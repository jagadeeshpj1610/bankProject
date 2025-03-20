import React, { useState } from "react";
import "../css/EditUser.css";

const EditUser = ({ userData, onClose }) => {
    const [formData, setFormData] = useState({
        name: userData.name,
        email: userData.email,
        aadhaar: userData.aadhaar,
        phone: userData.phone,
        address: userData.address,
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Unauthorized. Please log in.");
            return;
        }

        try {

            //fetch(`http://localhost:8000/api/admin/edituserprofile/${userData.account_number}
            const response = await fetch(`https://magadhabackend.onrender.com/api/admin/edituserprofile/${userData.account_number}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update user details.");
            }

            setSuccess("User details updated successfully!");
            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (err) {
            setError(err.message || "An error occurred.");
        }
    };

    return (
        <div className="editUserModal">
            <div className="modalContent">
                <h2>Edit User Details</h2>
                {error && <p className="errorMessage">{error}</p>}
                {success && <p className="successMessage">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label>Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="formGroup">
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="formGroup">
                        <label>Aadhar Number:</label>
                        <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} required />
                    </div>
                    <div className="formGroup">
                        <label>Phone Number:</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="formGroup">
                        <label>Address:</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="buttonContainer">
                        <button type="submit" className="saveButton">Save</button>
                        <button type="button" className="cancelButton" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;
