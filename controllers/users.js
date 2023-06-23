const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/NotFoundError');
const { ConflictError } = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;
const PARENT_DOMAIN = 'explorer.nomoreparties.sbs';
const DEV_DOMAIN = 'localhost';

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then(() => res.status(201).send('Registration successful'))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('User with this email already exist'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 1000 * 3600 * 24 * 7,
          httpOnly: true,
          domain: NODE_ENV === 'production' ? PARENT_DOMAIN : DEV_DOMAIN,
        })
        .send('Successfully logged in');
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send('Successfully logged out');
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
    .catch(next);
};
