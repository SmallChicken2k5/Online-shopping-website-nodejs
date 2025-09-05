const ProductCategory = require('../models/product-category.model');
async function getSubCategory(parentId) {
    const subs = await ProductCategory.find({
        parent_id: parentId,
        status: 'active',
        deleted: false
    });
    let allSub = [...subs];
    for (const sub of subs) {
        const childs = await getSubCategory(sub._id);
        allSub = allSub.concat(childs);
    }
    return allSub;
}
module.exports.getSubCategory = getSubCategory;