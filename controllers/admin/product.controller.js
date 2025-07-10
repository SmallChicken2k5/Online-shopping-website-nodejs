const product = require('../../models/product.model')
const filterStatusHelper = require('../../helpers/filterStatus')
const searchHelper = require('../../helpers/search')
const paginationHelper = require('../../helpers/pagination')
// [GET] /admin/products
module.exports.index = async (req,res) => {
    const find = {
        deleted: false,
    };
    // Button Status

    const buttonStatus = filterStatusHelper(req.query);
    if (req.query.status){
        find.status = req.query.status;
    }

    // End Button Status

    // Form Search Keyword

    objectSearch = searchHelper(req.query);
    if (objectSearch.regex){
        find.title = objectSearch.regex;
    }

    // End Form Search Keyword


    // Pagination

    let objectPagination = {
        currentPage: 1,
        limitItems : 4,
    };  
    const countProducts = await product.countDocuments(find);
    objectPagination = await paginationHelper(objectPagination, req.query, countProducts);
    // End Pagination

    const products = await product
        .find(find)
        .sort({position : 'desc'})
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.render('admin/pages/products', {
        title: 'Product Management',
        products: products,
        buttonStatus: buttonStatus,
        keyword:  objectSearch.keyword,
        pagination: objectPagination,
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    await product.updateOne({_id: id}, {status : status});
    req.flash('success', `Trạng thái sản phẩm đã được chuyển sang ${(status === 'active') ? 'hoạt động' : 'không hoạt động'}`);
    res.redirect(req.get('Referrer') || '/')
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(',');
    const type = req.body.type;
    switch (type) {
        case 'active':
            await product.updateMany({_id: {$in: ids}}, {status: 'active'});
            break;
        case 'inactive':
            await product.updateMany({_id: {$in: ids}}, {status: 'inactive'});
            break;
        case 'delete-all':
            await product.updateMany({_id: {$in: ids}}, {
                deleted: true,
                deletedAt: new Date(),
            });
            break;
        case 'change-position':
            for (let id of ids) {
                const [productId, position] = id.split('-');
                await product.updateOne({_id: productId}, {position: parseInt(position)});
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
    await product.updateOne({_id: id}, {
        deleted: true,
        deletedAt: new Date(),
    })
    req.flash('success', 'Sản phẩm đã được xóa thành công');
    res.redirect(req.get('Referrer') || '/')
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/products/create', {
        title: 'Tạo Sản Phẩm Mới',
    });
}
module.exports.createPost = async (req, res) => {
    console.log(req.file)
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    if (req.body.position === '') {
        const count = await product.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    req.body.thumbnail = `/uploads/${req.file.filename}`;
    newProduct = new product(req.body);
    await newProduct.save();
    res.redirect('/admin/products')
}