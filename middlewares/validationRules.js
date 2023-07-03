const { Joi } = require('celebrate');

const URL_REGEX = /^https?:\/\/(www\.)?[0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]+#?/;

module.exports.signupValidationObject = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

module.exports.signinValidationObject = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

module.exports.updateUserValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
};

module.exports.createMovieValidation = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(URL_REGEX),
    trailerLink: Joi.string().required().regex(URL_REGEX),
    thumbnail: Joi.string().required().regex(URL_REGEX),
    owner: Joi.string().required().hex().length(24),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
};

module.exports.deleteMovieValidation = {
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
};
