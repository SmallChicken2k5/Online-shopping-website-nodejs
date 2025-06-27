const product = require('../../models/product.model')
const filterStatus = require('../../helpers/filterStatus')
const search = require('../../helpers/search')
// [GET] /admin/products
module.exports.product = async (req,res) => {
    const find = {
        deleted: false,
    };
    // Button Status

    const buttonStatus = filterStatus(req.query);
    if (req.query.status){
        find.status = req.query.status;
    }

    // End Button Status

    // Form Search Keyword

    objectSearch = search(req.query);
    if (objectSearch.regex){
        find.title = objectSearch.regex;
    }

    // End Form Search Keyword


    // Pagination

    let objectPagination = {
        currentPage: 1,
        limitItems : 4,
    };  
    if (req.query.page){
        objectPagination.currentPage = parseInt(req.query.page);
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    const countProducts = await product.countDocuments(find);
    const totalPage = Math.ceil(countProducts / objectPagination.limitItems);
    objectPagination.totalPage = totalPage;
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