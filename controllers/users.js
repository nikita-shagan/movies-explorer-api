const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/NotFoundError');
const { ConflictError } = require('../errors/ConflictError');

const PARENT_DOMAIN = 'explorer.nomoreparties.sbs';
const DEV_DOMAIN = 'localhost';
const DEV_SECRET = 'dev-secret';

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then(() => res.status(201).send({ message: 'Registration successful' }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('User with this email already exist'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const isProduction = NODE_ENV === 'production';
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        isProduction ? JWT_SECRET : DEV_SECRET,
        { expiresIn: '7d' },
      );
      const cookieOptions = {
        maxAge: 1000 * 3600 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: true,
        domain: isProduction ? PARENT_DOMAIN : DEV_DOMAIN,
      };
      res.cookie('jwt', token, cookieOptions).send({ message: 'Successfully logged in' });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  const { NODE_ENV } = process.env;
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: true,
    domain: NODE_ENV === 'production' ? PARENT_DOMAIN : DEV_DOMAIN,
  };
  res.clearCookie('jwt', cookieOptions).send({ message: 'Successfully logged in' });
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail(new NotFoundError('User not found'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFoundError('User not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('User with this email already exist'));
      } else {
        next(err);
      }
    });
};
