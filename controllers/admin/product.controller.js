const product = require('../../models/product.model')

// [GET] /admin/products
module.exports.product = async (req,res) => {
    const find = {
        deleted: false,
    };
    // Button Status
    const buttonStatus = [
        {
            name: 'Tất cả',
            class:'btn btn-sm btn-outline-success',
            status: '',
        },
        {
            name: 'Hoạt động',
            class:'btn btn-sm btn-outline-success ms-1',
            status: 'active',
        },
        {
            name: 'Dừng hoạt động',
            class:'btn btn-sm btn-outline-success ms-1',
            status: 'inactive',
        }
    ]
    buttonStatus.forEach(item => {
        if (req.query.status === item.status || (item.status === '' && !req.query.status)){
            item.class += ' active'
        }
    })  

    if (req.query.status){
        find.status = req.query.status;
    }
    // End Button Status

    // Form Search Keyword
    let keyword = '';
    if (req.query.keyword) {
        keyword = req.query.keyword;
        const regex = new RegExp(keyword,'i');
        find.title = regex;
    }


    // End Form Search Keyword

    const products = await product.find(find);
    res.render('admin/pages/products', {
        title: 'Product Management',
        products: products,
        buttonStatus: buttonStatus,
        keyword: keyword
    })
}