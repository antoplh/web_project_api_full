import React from "react";
import closeButton from "../images/Close_Icon.png"; // Importar closeButton

function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup ${card ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button className="form__button-close" onClick={onClose}>
          <img
            src={closeButton}
            className="form__button-close-img"
            alt="cerrar"
          />
        </button>
        {card && (
          <>
            <img src={card.link} alt={card.name} className="popup__image" />
            <p className="popup__caption">{card.name}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default ImagePopup;
