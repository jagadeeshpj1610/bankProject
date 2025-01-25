const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

router.post('/login' , userController.login);
router.post('/signup', userController.userSignup);
router.get('/userDetails', userController.getUserDetailsAndTransactions);
// router.get('./money_transfer', userController.money_transfer);


module.exports = router;