const express = require('express');
const { register, login, getUserInfo, getAllUser, logout, googleLogin } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { forgetPassword, resetPassword } = require('../controllers/mailController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me/:userId', getUserInfo);
router.get('/getAllUser', getAllUser)
router.put('/logout/:userId', logout);
router.post('/google-login', googleLogin);
router.post("/forgot-password", forgetPassword)
router.post("/reset-password", resetPassword)



module.exports = router;
