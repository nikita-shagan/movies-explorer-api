const router = require('express').Router();
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../errors/NotFoundError');

const signupRouter = require('./signup');
const signinRouter = require('./signin');
const signoutRouter = require('./signout');
const usersRouter = require('./users');
const moviesRouter = require('./movies');

router.use('/signup', signupRouter);
router.use('/signin', signinRouter);
router.use('/signout', signoutRouter);
router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Endpoint does not exist'));
});

module.exports = router;
