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

