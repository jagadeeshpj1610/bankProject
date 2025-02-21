const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const verifyToken = require('../middleware/authMiddleware');


router.get('/userDetails', verifyToken, userController.getUserDetailsAndTransactions);
router.post('/money_transfer', verifyToken, userController.money_transfer);


module.exports = router;
