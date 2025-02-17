const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const verifyToken = require('../middleware/authMiddleware');

router.post('/login' , userController.login);
router.post('/signup', userController.userSignup);
router.get('/userDetails', verifyToken, userController.getUserDetailsAndTransactions);
router.post('/money_transfer', verifyToken, userController.money_transfer);
router.post("/send-otp", verifyToken, sendOTP);
router.post("/update-password",verifyToken, updatePassword);

module.exports = router;
