const express = require('express');
const router = express.Router();
const userController = require('../controllers/authControllers');
const jwt = require('jsonwebtoken');
const db = require('../models/db');


router.post('/login', authController.login);
router.post('/signup', authController.signup);
