const product = require('../../models/product.model');
const productsHelper = require('../../helpers/products');
const ProductCategory = require('../../models/product-category.model');
const productCategoryHelper = require('../../helpers/productCategory');
// [GET] /products
module.exports.index = async (req, res) => {
    const products = await product.find({
        status: 'active',
        deleted: false
    }).sort({position: 'desc'});
    const  discountedProducts = productsHelper.discountedPrice(products);
    res.render('client/pages/products/index',{
        title: 'Danh Sách Sản Phẩm',
        products: discountedProducts,
    })
}

// [GET] /products/:slugProduct
module.exports.detail = async (req, res) => {
    try {
        const find = {
            slug: req.params.slugProduct,
            status: 'active',
            deleted: false
        }
        const productDetail = await product.findOne(find);

        if (productDetail.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: productDetail.product_category_id,
                status: 'active',
                deleted: false
            })
            productDetail.category = category;
        }
        productDetail.priceNew = productsHelper.discountedPriceItem(productDetail);
        res.render('client/pages/products/detail',{
            title: productDetail.title,
            product: productDetail
        })        
    } catch (error) {
        req.flash('error', 'Sản phẩm không tồn tại hoặc đã bị xóa');
        res.redirect('/products');
    }

}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    try {
        const find = {
            slug: req.params.slugCategory,
            status: 'active',
            deleted: false
        }
        const productCategory = await ProductCategory.findOne(find);
        const id = productCategory._id;
        
        const categoryIds = (await productCategoryHelper.getSubCategory(id)).map(item => item.id);
        const products = await product.find({
            product_category_id: { $in: [id, ...categoryIds] },
            status: 'active',
            deleted: false
        })

        res.render('client/pages/products/index',{
            title: productCategory.title,
            description: productCategory.description,
            products: productsHelper.discountedPrice(products)
        })        
    } catch (error) {
        console.log(error)
        req.flash('error', 'Sản phẩm không tồn tại hoặc đã bị xóa');
        res.redirect('/products');
    }

}
