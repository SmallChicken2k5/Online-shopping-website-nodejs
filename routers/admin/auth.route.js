const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/auth.controller');
const validate = require('../../validates/admin/auth.validate');

// [GET] /admin/auth/login
router.get('/login', controller.login);

// [POST] /admin/auth/login
router.post(
    '/login', 
    validate.loginPost, 
    controller.loginPost
);

module.exports = router;