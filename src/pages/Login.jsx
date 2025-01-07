import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Footer, Navbar } from "../components";
import '../components/Login.css'

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:9091/login/", formData);

      if (response.data) {
        const userResponse = await axios.get(`http://localhost:9091/user/get/${formData.email}`);
        if (userResponse.data) {
          localStorage.setItem("user", JSON.stringify(userResponse.data));
          setSuccessMessage("Login Successful!");
          setIsAuthenticated(true);
          setTimeout(() => navigate("/"), 1500);
        } else {
          setErrorMessage("User data not found.");
        }
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Welcome Back!</h1>
          <p className="login-subtitle">Log in to access your account</p>
          <hr className="divider" />

          {errorMessage && (
            <div className="alert alert-danger custom-alert" role="alert">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success custom-alert" role="alert">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control custom-input"
                id="email"
                name="email"
                placeholder="name@example.com"
                onChange={handleInputChange}
                value={formData.email}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control custom-input"
                id="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleInputChange}
                value={formData.password}
                required
              />
            </div>
            <div className="login-links">
              <Link to="/register" className="custom-link">
                New here? Register
              </Link>
              <Link to="/forgetpassword" className="custom-link">
                Forgot Password?
              </Link>
            </div>
            <div className="text-center">
              <button type="submit" className="btn custom-btn">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
