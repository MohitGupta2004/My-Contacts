const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUser
} = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(validateToken, getUser);

module.exports = router;