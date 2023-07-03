const mongoose = require('mongoose');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).send({ message });
  } else if (statusCode === 500) {
    res.status(statusCode).send({ message: 'Internal server error' });
  } else {
    res.status(statusCode).send({ message });
  }
  next();
};
