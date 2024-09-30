const express = require('express');
const { register, login, getUserInfo, getAllUser } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me/:userId', getUserInfo);
router.get('/getAllUser', getAllUser)

module.exports = router;
