module.exports.index =  (req, res) => {
    res.render('client/pages/products/index',{
        title: 'Danh Sách Sản Phẩm',
    })
}