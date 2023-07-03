const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors/AuthError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { jwt: jwtToken } = req.cookies;
  const { NODE_ENV, JWT_SECRET } = process.env;

  if (!jwtToken) {
    next(new AuthError('Authorization required'));
    return;
  }

  const token = extractBearerToken(jwtToken);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthError(err.message));
    return;
  }

  req.user = payload;

  next();
};
