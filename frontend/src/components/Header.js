import React, { useState, useContext, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import CurrentUserContext from "../contexts/CurrentUserContext";
import logo from "../images/logo.png";

function Header({ isAuthenticated, onLogout }) {
  const currentUser = useContext(CurrentUserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    onLogout();
    navigate("/signin");
  };

  return (
    <header className="header">
      <div className="header__flexbox">
        <img
          id="image-logo"
          src={logo}
          className="header__logo"
          alt="logo de la pagina"
        />
        {isAuthenticated ? (
          <div className="header__actions">
            <p className="header__email">{currentUser.email}</p>
            <a
              href="#signout"
              onClick={handleSignOut}
              className="header__link header__logout"
            >
              Cerrar Sesión
            </a>
          </div>
        ) : location.pathname === "/signup" ? (
          <Link to="/signin" className="header__link">
            Iniciar sesión
          </Link>
        ) : (
          <Link to="/signup" className="header__link">
            Regístrate
          </Link>
        )}
      </div>
      <div className="header__line"></div>
    </header>
  );
}

export default Header;
