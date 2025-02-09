import React, { useRef, useContext } from "react";
import closeButton from "../images/Close_Icon.png"; // Importar closeButton
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditAvatar({ isOpen, onClose, onUpdateAvatar }) {
  const userContext = useContext(CurrentUserContext);
  const currentUser = userContext;

  const avatarInputRef = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarInputRef.current.value,
    });
    avatarInputRef.current.value = "";
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`popup popup_opened`}>
      <div className="popup__container">
        <button className="form__button-close" onClick={onClose}>
          <img
            src={closeButton}
            className="form__button-close-img"
            alt="cerrar"
          />
        </button>
        <h3 className="form__title">Actualizar avatar</h3>
        <form className="form" onSubmit={handleSubmit} noValidate>
          <fieldset className="form__set">
            <input
              ref={avatarInputRef}
              className="form__input"
              type="url"
              name="avatar"
              placeholder="URL del avatar"
              required
            />
            <span className="form__input-error avatar-input-error"></span>
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

export default EditAvatar;
