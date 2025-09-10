const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/cart.controller');

// [DELETE] /admin/carts/cleanup
router.delete(
    '/cleanup',
    controller.cleanup
)

module.exports = router;