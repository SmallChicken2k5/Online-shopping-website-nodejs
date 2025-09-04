const product = require('../../models/product.model')
const Account = require('../../models/account.model')
const ProductCategory = require('../../models/product-category.model');
const filterStatusHelper = require('../../helpers/filterStatus')
const searchHelper = require('../../helpers/search')
const paginationHelper = require('../../helpers/pagination')
const systemConfig = require('../../config/system');
const createTreeHelper = require('../../helpers/createTree');
// [GET] /admin/products
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };
    // Button Status

    const buttonStatus = filterStatusHelper(req.query);
    if (req.query.status) {
        find.status = req.query.status;
    }

    // End Button Status

    // Form Search Keyword

    objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // End Form Search Keyword


    // Pagination

    let objectPagination = {
        currentPage: 1,
        limitItems: 4,
    };
    const countProducts = await product.countDocuments(find);
    objectPagination = await paginationHelper(objectPagination, req.query, countProducts);
    // End Pagination
    // Sort 
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = 'desc';
    }
    // End Sort

    const products = await product
        .find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    for (let prod of products) {
        const user = await Account.findOne({
            _id : prod.createdBy.account_id
        })
        if (user){
            prod.accountFullName = user.fullName;
        }
    }
    
    res.render('admin/pages/products', {
        title: 'Product Management',
        products: products,
        buttonStatus: buttonStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    await product.updateOne({ _id: id }, { status: status });
    req.flash('success', `Trạng thái sản phẩm đã được chuyển sang ${(status === 'active') ? 'hoạt động' : 'không hoạt động'}`);
    res.redirect(req.get('Referrer') || '/')
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(',');
    const type = req.body.type;
    switch (type) {
        case 'active':
            await product.updateMany({ _id: { $in: ids } }, { status: 'active' });
            break;
        case 'inactive':
            await product.updateMany({ _id: { $in: ids } }, { status: 'inactive' });
            break;
        case 'delete-all':
            await product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date(),
                }
            });
            break;
        case 'change-position':
            for (let id of ids) {
                const [productId, position] = id.split('-');
                await product.updateOne({ _id: productId }, { position: parseInt(position) });
            }
            break;
        default:
            break;
    }
    const actionMap = {
        'active': 'kích hoạt',
        'inactive': 'không kích hoạt',
        'delete-all': 'xóa',
        'change-position': 'thay đổi vị trí',
    };
    req.flash('success', `Đã thực hiện thao tác ${actionMap[type]} thành công trên ${ids.length} sản phẩm`);
    res.redirect(req.get('Referrer') || '/')
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
    await product.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
        }
    })
    req.flash('success', 'Sản phẩm đã được xóa thành công');
    res.redirect(req.get('Referrer') || '/')
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }
    const productCategory = await ProductCategory.find(find);
    const categoriesTree = createTreeHelper(productCategory);
    res.render('admin/pages/products/create', {
        title: 'Tạo Sản Phẩm Mới',
        categoriesTree: categoriesTree
    });
}
// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {

    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    if (req.body.position === '') {
        const count = await product.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    req.body.createdBy = {
        account_id: res.locals.user.id,
    }
    newProduct = new product(req.body);
    await newProduct.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const editProduct = await product.findOne(
            {
                _id: id,
                deleted: false
            }
        );
        const productCategory = await ProductCategory.find(
            {
                deleted: false,
            }
        )
        const categoriesTree = createTreeHelper(productCategory);
        res.render('admin/pages/products/edit', {
            title: 'Chỉnh Sửa Sản Phẩm',
            product: editProduct,
            categoriesTree: categoriesTree
        });
    } catch (error) {
        req.flash('error', 'Sản phẩm không tồn tại hoặc đã bị xóa');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    const editProduct = await product.findOne(
        {
            _id: id,
            deleted: false
        }
    );
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    if (req.body.position === '') {
        const count = await product.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    } else {
        req.body.thumbnail = editProduct.thumbnail;
    }


    try {
        editProduct.set(req.body);
        await editProduct.save();
        req.flash('success', 'Sản phẩm đã được cập nhật thành công');
    } catch (error) {
        req.flash('error', 'Đã có lỗi xảy ra khi cập nhật sản phẩm');
        console.error(error);
    }
    // res.redirect(req.get('Referrer') || '/')
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    const find = {
        _id: req.params.id,
        deleted: false
    }
    const detailProduct = await product.findOne(find);
    let productCategory = null;
    if (detailProduct.product_category_id) {
        productCategory = await ProductCategory.findOne({ _id: detailProduct.product_category_id, deleted: false });
    }
    res.render('admin/pages/products/detail', {
        title: 'Chi Tiết Sản Phẩm',
        product: detailProduct,
        productCategory: productCategory
    });
}