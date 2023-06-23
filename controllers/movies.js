const mongoose = require('mongoose');
const Movie = require('../models/movie');
const { AccessDeniedError } = require('../errors/AccessDeniedError');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');

const isValidId = (id) => mongoose.isValidObjectId(id);

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const movieData = req.body;
  const { _id: userId } = req.user;

  Movie.create({ ...movieData, owner: userId })
    .then((movie) => movie.populate(['owner']))
    .then((movie) => res.status(201).send(movie))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { _id: movieId } = req.params;
  const { _id: userId } = req.user;

  if (!isValidId(movieId)) {
    next(new BadRequestError('Invalid movie id'));
    return;
  }

  Movie.findById(movieId)
    .orFail(new NotFoundError('Movie not found'))
    .populate(['owner'])
    .then((movie) => {
      if (movie.owner._id.toString() !== userId) {
        throw new AccessDeniedError('Not enough rights to delete movie');
      }
      return movie.deleteOne();
    })
    .then((movie) => res.send(movie))
    .catch(next);
};
