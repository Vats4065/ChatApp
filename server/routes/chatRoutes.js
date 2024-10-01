const express = require('express');
const { sendMessage, getMessages, } = require('../controllers/chatController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/multerMiddleware');
const router = express.Router();

router.post('/message', authMiddleware, upload.single('media'), sendMessage);
router.get('/messages/:recipient', authMiddleware, getMessages);

module.exports = router;
