const router = require('express').Router();
const { celebrate } = require('celebrate');
const { createUser } = require('../controllers/users');
const { signupValidationObject } = require('../middlewares/validationRules');

router.post('/', celebrate(signupValidationObject), createUser);

module.exports = router;
