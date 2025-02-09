const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

// Validador de URL personalizado
const validateURL = (value, helpers) => {
  if (
    !validator.isURL(value, {
      protocols: ['http', 'https'],
      require_protocol: true,
    })
  ) {
    return helpers.error('string.uri');
  }
  return value;
};

// Validación para crear una tarjeta
const validateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
});

// Validación para registrar usuario
const validateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

module.exports = {
  validateCard,
  validateUser,
};
