import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import axios from "axios";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const API_BASE_URL = "http://localhost:9091/auth"; // Backend API Base URL

  // Handle Email Submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/generate-otp`, { email });
      setSuccessMessage("OTP sent to your email.");
      setStep(2);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error generating OTP.");
    }
  };

  // Handle OTP Verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp?otp=${otp}`, { otp });
      if (response.data === true) {
        setSuccessMessage("OTP verified successfully.");
        setStep(3);
      } else {
        setErrorMessage("Invalid or expired OTP.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data || "Error verifying OTP.");
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`${API_BASE_URL}/update-password`, { newPassword });
      if (response.data === "Password updated successfully!") {
        setSuccessMessage("Password reset successfully.");
        setStep(1);
      } else {
        setErrorMessage("Unexpected response from the server.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Forget Password</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            {errorMessage && (
              <div className="alert alert-danger text-center" role="alert">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="alert alert-success text-center" role="alert">
                {successMessage}
              </div>
            )}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit}>
                <div className="my-3">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center">
                  <button className="btn btn-dark" type="submit">
                    Generate OTP
                  </button>
                </div>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleOtpSubmit}>
                <div className="my-3">
                  <label htmlFor="otp">Enter OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    id="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center">
                  <button className="btn btn-dark" type="submit">
                    Verify OTP
                  </button>
                </div>
              </form>
            )}
            {step === 3 && (
              <form onSubmit={handlePasswordReset}>
                <div className="my-3">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center">
                  <button className="btn btn-dark" type="submit">
                    Reset Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default ForgetPassword;