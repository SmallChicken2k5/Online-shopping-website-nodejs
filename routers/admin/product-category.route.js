const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/product-category.controller')
const multer = require('multer');
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

router.get('/', controller.index);

router.get('/create', controller.create);

router.get('/edit/:id', controller.edit);

router.patch(
    '/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.upload,
    controller.editPatch
);

router.post(
    '/create', 
    upload.single('thumbnail'), 
    uploadCloud.upload,
    controller.createPost
);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete-productCategory/:id', controller.deleteProduct);

module.exports = router;