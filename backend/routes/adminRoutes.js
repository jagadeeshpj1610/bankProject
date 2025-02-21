

const express = require('express');
const router = express.Router();

const {editUser, createAccount, fetchUserDetails, deposit, withdraw, money_transfer} = require('../controllers/adminController');

const verifyToken = require('../middleware/authMiddleware');

router.post('/account/create', verifyToken, createAccount);
router.get('/search', verifyToken, fetchUserDetails);
router.post('/deposit', verifyToken, deposit);
router.post('/withdraw', verifyToken, withdraw);
router.post('/moneyTransfer', verifyToken, money_transfer);
router.put('/edituserprofile/:account_number', verifyToken, editUser)

module.exports = router;
