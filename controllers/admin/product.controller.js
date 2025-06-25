// [GET] /admin/products
module.exports.product = (req,res) => {
    res.render('admin/pages/products', {
        title: 'Product Management',
        message: 'Manage your products here'
    })
}