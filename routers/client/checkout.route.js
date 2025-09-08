const express = require('express')
const router = express.Router()
const controller = require('../../controllers/client/checkout.controller')
const authMiddleware = require('../../middlewares/client/auth.middleware')

router.get('/', controller.index)

router.post('/order', controller.orderPost)

router.get(
    '/success/:id', 
    controller.success)

module.exports = router;