// orders/order.routes.js

const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');

// Define routes
router.post('/place', orderController.placeOrder);

module.exports = router;
