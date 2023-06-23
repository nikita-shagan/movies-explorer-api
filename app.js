const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
const errorsHandler = require('./middlewares/errorsHandler');
const corsHandler = require('./middlewares/corsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimiter');
require('dotenv').config();

const { PORT = 3000, DATABASE_NAME, NODE_ENV } = process.env;

const app = express();

const databaseName = NODE_ENV === 'production' ? DATABASE_NAME : 'movies_explorer_db';
mongoose.connect(`mongodb://127.0.0.1:27017/${databaseName}`);

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsHandler);
app.use(requestLogger);

app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
