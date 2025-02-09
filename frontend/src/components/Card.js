import { useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import binIcon from "../images/bin.png";
import heartIcon from "../images/heart_deac.svg";
import heartActiveIcon from "../images/heart_active.svg";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  // Verificar si el usuario actual dio like a esta tarjeta
  const isLiked = card.likes.some((user) => user._id === currentUser._id);
  const cardLikeButtonClassName = `card__heart ${
    isLiked ? "card__heart_active" : ""
  }`;

  // Verificar si el usuario actual es el dueño de esta tarjeta
  const isOwner = card.owner._id === currentUser._id;

  const handleLikeClick = () => onCardLike(card);
  const handleDeleteClick = () => onCardDelete(card);

  return (
    <div className="card">
      {isOwner && (
        <button
          className="card__delete"
          onClick={handleDeleteClick}
          style={{
            backgroundImage: `url(${binIcon})`,
          }}
        ></button>
      )}
      <img
        className="card__image"
        src={card.link}
        alt={card.name}
        onClick={() => onCardClick(card)}
      />
      <div className="card__description">
        <h3 className="card__title">{card.name}</h3>
        <button
          className={cardLikeButtonClassName}
          onClick={handleLikeClick}
          style={{
            backgroundImage: `url(${isLiked ? heartActiveIcon : heartIcon})`,
          }}
          data-likes={card.likes.length}
        ></button>
      </div>
    </div>
  );
}

export default Card;
