const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/login' , adminController.login);
router.post('/account/create', adminController.createAccount);
router.post('/signup', adminController.adminSignup);
router.get('/search', adminController.fetchUserDetails);
router.post('/deposit', adminController.deposit);
router.post('/withdraw', adminController.withdraw)
router.post('/moneyTransfer', adminController.money_transfer)

module.exports = router;