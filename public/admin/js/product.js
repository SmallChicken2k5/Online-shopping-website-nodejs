// Change Status
const buttonChangeStatus = document.querySelectorAll('[button-change-status]');
if (buttonChangeStatus) {
    const formChangeStatus = document.querySelector('#form-change-status');
    const path = formChangeStatus.getAttribute('data-path');
    buttonChangeStatus.forEach(button => {
        button.addEventListener(`click`,() => {
            const status = button.getAttribute('data-status');
            const id = button.getAttribute('data-id');
            const changeStatus = (status === 'active' ? 'inactive' : 'active');
            formChangeStatus.action = path + `/${changeStatus}/${id}?_method=PATCH`;
            formChangeStatus.submit();
        })
    })
}
// End Change Status

// Delete Product
const buttonDeleteProduct = document.querySelectorAll('[button-delete]');
if (buttonDeleteProduct.length > 0) {
    const formDeleteProduct = document.querySelector('#form-delete-product');
    const path = formDeleteProduct.getAttribute('data-path');
    buttonDeleteProduct.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
                return;
            }
            formDeleteProduct.action = path + `/${id}?_method=DELETE`;
            formDeleteProduct.submit();
        })
    })
}