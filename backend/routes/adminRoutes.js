
const express = require('express');
const router = express.Router();
const adminController = require('../handlers/adminHandler');


router.post('/login', adminHandler.login);

module.exports = router;
