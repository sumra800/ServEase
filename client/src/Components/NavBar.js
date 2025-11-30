import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import "./NavBar.css";

function NavBar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick((prev) => !prev);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    setButton(window.innerWidth > 960);
  };

  useEffect(() => {
    showButton();
    window.addEventListener("resize", showButton);
    return () => window.removeEventListener("resize", showButton);
  }, []);

  return (
    <nav className="NavBar">
      <div className="NavBar-container">

        <h1 className="logo">Welcome to ServEase</h1>

        <div className="menu-icon" onClick={handleClick}>
          {click ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/services" className="nav-links" onClick={closeMobileMenu}>
              Services
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/about" className="nav-links" onClick={closeMobileMenu}>
              About Us
            </Link>
          </li>

          {button && (
            <li className="nav-item nav-btn">
              <Button buttonStyle="btn--outline">Sign Up</Button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
