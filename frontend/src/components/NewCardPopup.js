import React, { useState } from "react";
import closeButton from "../images/Close_Icon.png"; // Importar el ícono de cierre

function NewCardPopup({ isOpen, onClose, onAddCard }) {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCard({ title, imageUrl });
    setTitle("");
    setImageUrl("");
    onClose();
  };

  if (!isOpen) return null; // No renderizar nada si el popup no está abierto

  return (
    <div className="popup popup_opened">
      <div className="popup__container">
        <button className="form__button-close" type="button" onClick={onClose}>
          <img
            src={closeButton}
            className="form__button-close-img"
            alt="cerrar"
          />
        </button>
        <h3 className="form__title">Nuevo Lugar</h3>
        <form
          className="form"
          id="place-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <fieldset className="form__set">
            <input
              id="title-input"
              className="form__input"
              type="text"
              name="title"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength="2"
              maxLength="30"
              required
            />
            <span className="form__input-error title-input-error"></span>
            <input
              id="url-input"
              className="form__input"
              type="url"
              name="url"
              placeholder="URL de la imagen"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
            <span className="form__input-error url-input-error"></span>
            <button
              className="form__button-save form__button-save_active"
              type="submit"
            >
              Guardar
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default NewCardPopup;
