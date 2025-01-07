import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import "./Navbar.css"; // Custom styles

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const state = useSelector((state) => state.handleCart);

  const [categories, setCategories] = useState([]);

  // Fetch categories from the API
  useEffect(() => {
    axios
      .get("http://localhost:9091/category/get")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Check user role from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isSeller =
    user && user.role && user.role.some((role) => role.name === "Seller");

  // Logout handler
  const logoutHandler = () => {
    localStorage.removeItem("user");
    dispatch({ type: "CLEARCART" });

    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
      <div className="container">
        {/* Brand Heading */}
        <NavLink className="navbar-brand fw-bold fs-4" to="/">
          Ecommerce Store
        </NavLink>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/product">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Buttons Floated Right */}
          <div className="navbar-buttons ms-auto">
            {isAuthenticated ? (
              <>
                {isSeller && (<SellerDropdown />)}

                <NavLink to="/profile" className="btn btn-outline-primary">
                  <i className="fa fa-user"></i> Profile
                </NavLink>
                <NavLink to="/cart" className="btn btn-outline-dark">
                  <i className="fa fa-cart-shopping"></i> Cart ({state.length})
                </NavLink>
                <button
                  onClick={logoutHandler}
                  className="btn btn-outline-danger"
                >
                  <i className="fa fa-sign-out-alt"></i> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-outline-primary">
                  <i className="fa fa-sign-in-alt"></i> Login
                </NavLink>
                <NavLink to="/register" className="btn btn-outline-secondary">
                  <i className="fa fa-user-plus"></i> Register
                </NavLink>
                <NavLink to="/cart" className="btn btn-outline-dark">
                  <i className="fa fa-cart-shopping"></i> Cart ({state.length})
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};


const SellerDropdown = ({ isSeller }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return ((
      <div className="dropdown">
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
        >
          Seller Options
        </button>
        {isOpen && (
          <ul className="dropdown-menu show">
            <li>
              <NavLink to="/addproduct" className="dropdown-item">
                <i className="fa fa-plus"></i> Add Product
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-product" className="dropdown-item">
                <i className="fa fa-cogs"></i> My Products
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    )
  );
};

export default Navbar;
