import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/forgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const sendOtp = async () => {
        if (!email) {
            setErrorMessage("Email is required.");
            return;
        }

        try {

            //fetch("http://localhost:8000/api/auth/send-otp"
            const response = await fetch("https://magadhabackend.onrender.com/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (data.message === "OTP sent successfully.") {
                setStep(2);
                setErrorMessage("");
            } else {
                setErrorMessage("Failed to send OTP. Try again.");
            }
        } catch (error) {
            setErrorMessage("Something went wrong. Try again.");
            console.error("Error sending OTP:", error);
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            setErrorMessage("OTP is required.");
            return;
        }

        try {

            //fetch("http://localhost:8000/api/auth/verify-otp"
            const response = await fetch("https://magadhabackend.onrender.com/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await response.json();

            if (data.message === "OTP verified. You can reset your password now.") {
                setStep(3);
                setErrorMessage("");
            } else {
                setErrorMessage("Invalid OTP. Try again.");
            }
        } catch (error) {
            setErrorMessage("Something went wrong. Try again.");
            console.error("Error verifying OTP:", error);
        }
    };

    const resetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setErrorMessage("Both password fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {

            //fetch("http://localhost:8000/api/auth/reset-password"
            const response = await fetch("https://magadhabackend.onrender.com/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });
            const data = await response.json();

            if (data.message === "Password reset successful. You can now log in.") {
                setStep(4);
                setSuccessMessage("Password reset successful. Redirecting to login...");
                setErrorMessage("");

                setTimeout(() => {
                    navigate("/login");
                }, 5000);
            } else {
                setErrorMessage("Failed to reset password. Try again.");
            }
        } catch (error) {
            setErrorMessage("Something went wrong. Try again.");
            console.error("Error resetting password:", error);
        }
    };

    return (
        <div className="forgot-password-container">
            {step === 1 && (
                <div className="form-card">
                    <h2>Forgot Password</h2>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                    />
                    <button onClick={sendOtp} className="action-button" disabled={!email}>Send OTP</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            )}
            {step === 2 && (
                <div className="form-card">
                    <h2>Enter OTP</h2>
                    <label>OTP</label>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="input-field"
                    />
                    <button onClick={verifyOtp} className="action-button" disabled={!otp}>Verify OTP</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            )}
            {step === 3 && (
                <div className="form-card">
                    <h2>Reset Password</h2>
                    <label>New Password</label>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-field"
                    />
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field"
                    />
                    <button onClick={resetPassword} className="action-button" disabled={!newPassword || !confirmPassword}>Reset</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            )}
            {step === 4 && (
                <div className="form-card success-message">
                    <h2>Password Reset Successful</h2>
                    <p>{successMessage}</p>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
