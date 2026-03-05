import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import Button from "./Button";

function NavBar() {
  const [click, setClick] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    closeMobileMenu();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About Us", path: "/about" },
    { name: "Support", path: "/support" },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
          }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <Link
            to="/"
            className={`text-2xl font-heading font-bold tracking-tight ${scrolled ? "text-primary-600" : "text-primary-600"
              }`}
            onClick={closeMobileMenu}
          >
            ServEase
          </Link>

          <div className="md:hidden" onClick={handleClick}>
            {click ? (
              <FaTimes className="text-2xl text-neutral-800" />
            ) : (
              <FaBars className="text-2xl text-neutral-800" />
            )}
          </div>

          <ul className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-base font-medium transition-colors hover:text-primary-600 ${location.pathname === link.path
                    ? "text-primary-600"
                    : "text-neutral-600"
                    }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            {currentUser ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className={`text-base font-medium transition-colors hover:text-primary-600 ${location.pathname === "/dashboard"
                      ? "text-primary-600"
                      : "text-neutral-600"
                      }`}
                  >
                    <FaUser className="inline mr-1" />
                    Dashboard
                  </Link>
                </li>
                {currentUser.role === 'admin' && (
                  <li>
                    <Link
                      to="/admin"
                      className="text-base font-medium text-neutral-600 hover:text-primary-600 transition-colors"
                    >
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <div className="flex gap-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {click && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 w-full bg-white shadow-lg z-40 flex flex-col p-4 gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-lg font-medium text-neutral-800 py-2 border-b border-neutral-100"
                onClick={closeMobileMenu}
              >
                {link.name}
              </Link>
            ))}
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-lg font-medium text-neutral-800 py-2 border-b border-neutral-100"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-lg font-medium text-neutral-800 py-2 border-b border-neutral-100"
                    onClick={closeMobileMenu}
                  >
                    Admin
                  </Link>
                )}
                <Button variant="outline" className="w-full mt-2" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMobileMenu}>
                  <Button variant="primary" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavBar;
