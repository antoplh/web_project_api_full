import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import Main from "./Main";
import CurrentUserContext from "../contexts/CurrentUserContext";
import ProtectedRoute from "./ProtectedRoute";
import { validateToken } from "../utils/auth";
import api from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmPopup from "./ConfirmPopup";
import ImagePopup from "./ImagePopup";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [userFromToken, setUserFromToken] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");
  const [cards, setCards] = useState([]);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwt"));
  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);

  useEffect(() => {
    if (token) {
      api.setToken(token);
      validateToken(token)
        .then((data) => {
          setIsAuthenticated(true);
          setUserFromToken(data);
        })
        .catch(() => {
          localStorage.removeItem("jwt");
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const handleLogin = (data) => {
    localStorage.setItem("jwt", data.token);
    setIsAuthenticated(true);
    setToken(data.token);
    api.setToken(data.token);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsAuthenticated(false);
    setCurrentUser({});
  };

  useEffect(() => {
    if (isAuthenticated) {
      api
        .getUserInfo()
        .then((userInfo) => {
          setCurrentUser((prevState) => ({
            ...userInfo,
            email: userFromToken?.email || userInfo.email,
          }));
        })
        .catch((error) => {
          console.error(
            `Error al obtener la información del usuario: ${error}`
          );
          setIsAuthenticated(false); // Invalida la sesión si hay un error
        });

      api
        .getCards()
        .then((cardsData) => {
          setCards(cardsData);
        })
        .catch((error) => {
          console.error(`Error al obtener las tarjetas: ${error}`);
          setCards([]); // Se asegura que no haya datos previos si ocurre un error
        });
    }
  }, [isAuthenticated, userFromToken]);

  const handleDeleteConfirm = (card) => {
    if (!card || !card._id) {
      console.error("Error: No se puede eliminar una tarjeta inválida.", card);
      return;
    }

    api
      .deleteCard(card._id)
      .then(() => {
        setCards((prevCards) => prevCards.filter((c) => c._id !== card._id));
        setIsConfirmPopupOpen(false);
        setCardToDelete(null);
      })
      .catch((error) => {
        // Imprimir el mensaje específico del error
        const errorMessage = error.response
          ? error.response.data.message
          : error.message;
        console.error(`Error al eliminar la tarjeta: ${errorMessage}`);
      })
      .finally(() => {
        setIsConfirmPopupOpen(false); // Asegúrate de que el popup se cierre después de la eliminación
      });
  };

  // Actualizar avatar
  const handleUpdateAvatar = async (data) => {
    try {
      const updatedUser = await api.setUserAvatar(data);
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("Error al actualizar el avatar:", error);
    }
  };

  // Actualizar perfil del usuario
  const handleUpdateUser = async (data) => {
    try {
      const updatedUser = await api.setUserInfo(data);
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard(null);
  };
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    // Limpiar el evento cuando el componente se desmonta
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>; // Puedes usar un spinner o cualquier indicador de carga aquí
  }

  const handleCardLike = async (card) => {
    const isLiked = card.likes.some((like) => like === currentUser._id);
    try {
      const response = await api.changeLikeCardStatus(card._id, !isLiked);
      const newCard = response; // Suponiendo que `response` ya sea el objeto actualizado
      setCards((state) =>
        state.map((currentCard) =>
          currentCard._id === card._id ? newCard : currentCard
        )
      );
    } catch (error) {
      console.error("Error al actualizar el like:", error);
    }
  };

  // Agregar nueva tarjeta
  const handleAddCard = async (cardData) => {
    try {
      const newCard = await api.addCard({
        name: cardData.title,
        link: cardData.imageUrl,
      });
      setCards((prevCards) => [newCard, ...prevCards]);
    } catch (error) {
      console.error("Error al agregar la tarjeta:", error);
    }
  };
  function handleCardDelete(card) {
    setCardToDelete(card);
    setIsConfirmPopupOpen(true);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route
            path="/signin"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" /> : <Register />}
          />
          {/* Ruta principal, solo mostrada cuando el usuario esté autenticado */}
          <Route
            path="/"
            element={
              <ProtectedRoute
                component={Main}
                isAuthenticated={isAuthenticated}
                user={currentUser}
                onEditProfileClick={() => setIsEditProfilePopupOpen(true)}
                onAddPlaceClick={() => setIsAddPlacePopupOpen(true)}
                onEditAvatarClick={() => setIsEditAvatarPopupOpen(true)}
                onCardClick={(card) => setSelectedCard(card)}
                cards={cards}
                onAddCard={handleAddCard}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            }
          />
        </Routes>
        <ImagePopup card={selectedCard} onClose={() => setSelectedCard(null)} />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={() => setIsEditAvatarPopupOpen(false)}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={() => setIsEditProfilePopupOpen(false)}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={() => setIsAddPlacePopupOpen(false)}
          onAddCard={handleAddCard}
        />
        <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={() => setIsConfirmPopupOpen(false)}
          onConfirmDelete={() => handleDeleteConfirm(cardToDelete)}
          card={cardToDelete}
        />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
