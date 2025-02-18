import React from "react";
import closeButton from "../images/Close_Icon.png";

function ConfirmPopup({ isOpen, onClose, onConfirmDelete, card }) {
  const handleConfirm = () => {
    if (!card || !card._id) {
      console.error("Error: No se ha seleccionado una tarjeta válida.");
      return;
    }
    console.log("Confirmando eliminación de tarjeta:", card);
    onConfirmDelete(card); // Eliminar tarjeta
    onClose(); // Cerrar popup
  };

  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <h3 className="form__title">¿Estás seguro?</h3>
        <button
          className="form__button-save form__button-save_active"
          type="button"
          onClick={handleConfirm}
        >
          Sí
        </button>
      </div>
    </div>
  );
}

export default ConfirmPopup;
