const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/order.controller');


router.get(
    '/',
    controller.index
)

router.patch(
    '/approve/:id',
    controller.approval
)

router.patch(
    '/reject/:id',
    controller.rejection
)

router.get(
    '/detail/:id',
    controller.detail
)
module.exports = router;