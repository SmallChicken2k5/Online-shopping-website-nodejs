const ProductCategory = require('../../models/product-category.model');
const systemConfig = require('../../config/system');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const pagination = require('../../helpers/pagination');
// [GET] /admin/products-category   
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }

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
    const countProductsCategory = await ProductCategory.countDocuments(find);
    objectPagination = await paginationHelper(objectPagination, req.query, countProductsCategory);
    // End Pagination
    // Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = 'desc';
    }
    // End Sort 
    const productCategory = await ProductCategory
        .find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.render('admin/pages/products-category/index', {
        title: 'Danh mục sản phẩm',
        records : productCategory,
        buttonStatus: buttonStatus,
        pagination: objectPagination,
    });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    function createTree(arr, parentId = ''){
        const tree = [];
        arr.forEach(item => {
            if (item.parent_id === parentId) {
                const newItem = item;
                const children = createTree(arr, item.id);
                if (children.length > 0) {
                    newItem.children = children;
                }
                tree.push(newItem);
            }
        });
        return tree;
    }
    
    const records = await ProductCategory.find(find);

    const categoriesTree = createTree(records);
    
    res.render('admin/pages/products-category/create', {
        title: 'Thêm danh mục sản phẩm',
        records: categoriesTree,
    });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position === '') {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const productCategory = new ProductCategory(req.body);
    await productCategory.save();
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}


// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    await ProductCategory.updateOne({ _id: id }, { status: status });
    req.flash('success', `Trạng thái sản phẩm đã được chuyển sang ${(status === 'active') ? 'hoạt động' : 'không hoạt động'}`);
    res.redirect(req.get('Referrer') || '/')  
}

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(',');
    const type = req.body.type;
    switch (type) {
        case 'active':
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: 'active' });
            break;
        case 'inactive':
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: 'inactive' });
            break;
        case 'delete-all':
            await ProductCategory.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date(),
            });
            break;
        case 'change-position':
            for (let id of ids) {
                const [_id, position] = id.split('-');
                await product.updateOne({ _id: _id }, { position: parseInt(position) });
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

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
    await ProductCategory.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date(),
    })
    req.flash('success', 'Sản phẩm đã được xóa thành công');
    res.redirect(req.get('Referrer') || '/')
}