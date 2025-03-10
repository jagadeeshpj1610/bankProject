const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');



router.post('/login', authController.login);
router.post('/signup', authController.userSignup);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/send-otp', authController.sendOtp);


module.exports = router;
