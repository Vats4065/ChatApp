const express = require('express');
const { register, login, getUserInfo, getAllUser, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me/:userId', getUserInfo);
router.get('/getAllUser', getAllUser)
router.put('/logout/:userId', logout);


module.exports = router;
