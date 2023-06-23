const router = require('express').Router();
const { celebrate } = require('celebrate');
const { updateProfile, getCurrentUser } = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/validationRules');

router.get('/me', getCurrentUser);
router.patch('/me', celebrate(updateUserValidation), updateProfile);

module.exports = router;
