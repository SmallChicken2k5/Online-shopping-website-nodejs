module.exports.discountedPrice = (products) => {
    const discountedProducts = products.map((item) => {
        item.discountedPrice = item.price - (item.price * item.discountPercentage / 100);
        item.discountedPrice = item.discountedPrice.toFixed(2);
        return item;
    });
    return discountedProducts;
}