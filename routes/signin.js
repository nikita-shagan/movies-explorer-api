const router = require('express').Router();
const { celebrate } = require('celebrate');
const { login } = require('../controllers/users');
const { signinValidationObject } = require('../middlewares/validationRules');

router.post('/', celebrate(signinValidationObject), login);

module.exports = router;
