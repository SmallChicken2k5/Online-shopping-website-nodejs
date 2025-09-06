// Update quantity product in cart
const inputQuantitys = document.querySelectorAll('input[name="quantity"]');
if (inputQuantitys.length > 0) {
    inputQuantitys.forEach(input => {
        input.addEventListener('change' , (e) => {
            const productId = e.target.getAttribute('product-id');
            const quantity = e.target.value;
            if (quantity < 1) {
                window.location.href = `cart/delete/${productId}`;
            } else {
                window.location.href = `cart/update/${productId}/${quantity}`;
            }
        })
    });
}
// End Update quantity product in cart