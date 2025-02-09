import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { signup } from "../utils/auth";
import InfoTooltip from "./InfoTooltip";
import { isCompositeComponent } from "react-dom/test-utils";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = "Por favor, ingresa un email válido";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      signup(email, password)
        .then((data) => {
          if (data) {
            setIsOpen(true); // Mostrar el popup
            setMessage("¡Correcto! Ya estás registrado.");
            setIsError(false);

            // Retrasar la redirección para que el usuario vea el popup
            setTimeout(() => {
              navigate("/signin");
            }, 1000);
          }
        })
        .catch((error) => {
          console.error("Registration failed:", error);
          setIsOpen(true);
          setIsError(true);
          setMessage(error.message);
        });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="register">
      <h2 className="register__title">Regístrate</h2>
      <form className="register__form" onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          className="register__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo Electrónico"
          required
        />

        <input
          type="password"
          id="password"
          className="register__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />

        <button type="submit" className="register__button">
          Regístrate
        </button>
        <Link to="/signin" className="register__suggestion">
          <p>¿Ya eres miembro? Inicia sesión aquí</p>
        </Link>
      </form>
      <InfoTooltip
        isOpen={isOpen}
        onClose={handleClose}
        message={message}
        isError={isError}
      />
    </div>
  );
}

export default Register;
