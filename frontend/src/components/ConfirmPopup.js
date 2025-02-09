import React from "react";
import closeButton from "../images/Close_Icon.png";

function ConfirmPopup({ isOpen, onClose, onConfirm, card }) {
  const handleConfirm = () => {
    onConfirm(card); // Llama a la función para eliminar la tarjeta
    onClose(); // Cierra el popup después de la confirmación
  };

  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <form className="form" id="confirm-form" novalidate>
          <fieldset className="form__set">
            <button
              className="form__button-close"
              type="button"
              onClick={onClose}
            >
              <img
                className="form__button-close-img"
                alt="close button"
                src={closeButton}
              />
            </button>
            <h3 className="form__title">¿Estás seguro?</h3>
            <button
              className="form__button-save form__button-save_active"
              type="button"
              onClick={handleConfirm}
            >
              Sí
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default ConfirmPopup;
