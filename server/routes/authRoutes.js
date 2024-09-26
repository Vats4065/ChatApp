const express = require('express');
const { register, login, getUserInfo } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getUserInfo);

module.exports = router;
