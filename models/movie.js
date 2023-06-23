const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Field "country" should not be empty'],
  },
  director: {
    type: String,
    required: [true, 'Field "director" should not be empty'],
  },
  duration: {
    type: Number,
    required: [true, 'Field "duration" should not be empty'],
  },
  year: {
    type: String,
    required: [true, 'Field "year" should not be empty'],
  },
  description: {
    type: String,
    required: [true, 'Field "description" should not be empty'],
  },
  image: {
    type: String,
    required: [true, 'Field "image" should not be empty'],
    validate: {
      validator: (l) => validator.isURL(l),
      message: 'Некорректный URL',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Field "trailerLink" should not be empty'],
    validate: {
      validator: (l) => validator.isURL(l),
      message: 'Некорректный URL',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Field "trailerLink" should not be empty'],
    validate: {
      validator: (l) => validator.isURL(l),
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Field "owner" should not be empty'],
  },
  movieId: {
    type: Number,
    required: [true, 'Field "movieId" should not be empty'],
  },
  nameRU: {
    type: String,
    required: [true, 'Field "nameRU" should not be empty'],
  },
  nameEN: {
    type: String,
    required: [true, 'Field "nameEN" should not be empty'],
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', cardSchema);
