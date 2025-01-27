

const express = require('express');
const router = express.Router();

const {createAccount, fetchUserDetails, deposit, withdraw, money_transfer, adminSignup} = require('../controllers/adminController');
const {login} = require('../controllers/adminController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/login' , login);
router.post('/account/create', verifyToken, createAccount);
router.post('/signup', adminSignup);
router.get('/search', verifyToken, fetchUserDetails);
router.post('/deposit', verifyToken, deposit);
router.post('/withdraw', verifyToken, withdraw);
router.post('/moneyTransfer', verifyToken, money_transfer);

module.exports = router;
