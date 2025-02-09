import React, { useEffect } from "react";
import closeIcon from "../images/Close_Icon.png";
import okIcon from "../images/ok.png";
import failIcon from "../images/deny.png";

function InfoTooltip({ isOpen, onClose, message, isError }) {
  useEffect(() => {
    const handleEscClose = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscClose);
    }

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [isOpen, onClose]);

  const icon = isError ? failIcon : okIcon;

  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container infoTooltip__popup">
        <button className="form__button-close" onClick={onClose}>
          <img src={closeIcon} alt="cerrar" />
        </button>
        <img src={icon} className="infoTooltip__icon" />
        <p className="infoTooltip__message">{message}</p>
      </div>
    </div>
  );
}

export default InfoTooltip;
