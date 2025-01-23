const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/login' , adminController.login);
router.post('/account/create', adminController.createAccount);
router.post('/signup', adminController.adminSignup);
router.get('/search', adminController.fetchUserDetails);


module.exports = router;