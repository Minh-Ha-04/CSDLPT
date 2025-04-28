const express = require('express');
const router = express.Router();
const supermarketController = require('../controller/controller');

// GET all supermarkets
router.get('/supermarkets', supermarketController.getAllSupermarkets);

// GET single supermarket by ID
router.get('/supermarkets/:id', supermarketController.getSupermarketById);

module.exports = router;
