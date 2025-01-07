import React from "react";
import "./Footer.css"; // Custom CSS file

const Footer = () => {
  return (
    <footer className="simple-footer">
      <div className="footer-container">
        <p className="footer-text">
          Made with <span className="heart">❤️</span> by{" "}
          <a
            href="https://github.com/mahadumair26"
            className="footer-link"
            target="_blank"
            rel="noreferrer"
          >
            Fahd, Mahad, and Rafay
          </a>
        </p>
        <a
          className="footer-icon-link"
          href="https://github.com/mahadumair26"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fa fa-github footer-icon"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
