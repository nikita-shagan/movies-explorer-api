const router = require('express').Router();
const { celebrate } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { createMovieValidation, deleteMovieValidation } = require('../middlewares/validationRules');

router.get('/', getMovies);
router.post('/', celebrate(createMovieValidation), createMovie);
router.delete('/:_id', celebrate(deleteMovieValidation), deleteMovie);

module.exports = router;
