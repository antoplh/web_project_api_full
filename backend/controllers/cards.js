const Card = require('../models/card');
const mongoose = require('mongoose'); // Importa mongoose
// Obtener todas las tarjetas
const getCards = async (req, res, next) => {
  try {
    // Se pueden agregar .populate('owner') o .populate('likes') si necesitas más detalles
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (err) {
    next(err);
  }
};

// Crear una nueva tarjeta
const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    // Se asume que el middleware de autenticación asigna req.user
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};

// Eliminar una tarjeta
const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    // Verificar si el cardId es válido antes de intentar buscar la tarjeta
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: 'ID de tarjeta inválido' });
    }

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: 'Tarjeta no encontrada' });
    }

    if (String(card.owner) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: 'No autorizado para eliminar esta tarjeta' });
    }

    // Usar findByIdAndDelete en lugar de findByIdAndRemove
    await Card.findByIdAndDelete(cardId);

    res.status(200).json({ message: 'Tarjeta eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar la tarjeta:', err);
    next(err);
  }
};

// Dar like a una tarjeta
const likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    // Agrega el id del usuario actual al array de likes, sin duplicados
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!card) {
      return res.status(404).json({ message: 'Tarjeta no encontrada' });
    }
    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
};

// Quitar like (dislike) de una tarjeta
const dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!card) {
      return res.status(404).json({ message: 'Tarjeta no encontrada' });
    }
    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
