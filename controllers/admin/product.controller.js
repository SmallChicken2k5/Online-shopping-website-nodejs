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

    const products = await product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
    res.render('admin/pages/products', {
        title: 'Product Management',
        products: products,
        buttonStatus: buttonStatus,
        keyword:  objectSearch.keyword,
        pagination: objectPagination,
    })
}


// [GET] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    await product.updateOne({_id: id}, {status : status});
    res.redirect(req.get('Referrer') || '/')
}