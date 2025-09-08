// Start Button status 
const buttonStatus = document.querySelectorAll('[button-status]');
if (buttonStatus.length > 0) {
    buttonStatus.forEach(item => {
        item.addEventListener('click', () => {
            const status = item.getAttribute('button-status');
            const url = new URL(window.location.href);
            if (status) {
                url.searchParams.set('status', status);
            }
            else {
                url.searchParams.delete('status');
            }
            url.searchParams.set('page', 1);
            window.location.href = url.href;
        })
    })
}
// End Button status

// Form Search

const formSearch = document.querySelector('#form-search');
if (formSearch) {
    formSearch.addEventListener('submit', e => {
        e.preventDefault();
        const url = new URL(window.location.href);
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set('keyword', keyword);
        } else {
            url.searchParams.delete('keyword');
        }
        url.searchParams.set('page', 1);
        window.location.href = url.href;
    })
}

// End Form Search

// Pagination

const buttonPagination = document.querySelectorAll('[button-pagination]');
if (buttonPagination) {
    buttonPagination.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('button-pagination');
            const url = new URL(window.location.href);
            url.searchParams.set('page', page);
            window.location.href = url.href;
        })
    })
}

// End Pagination

// Checkbox Multi Status  
const checkboxMulti = document.querySelector('[checkbox-multi]')
if (checkboxMulti) {
    const checkAll = checkboxMulti.querySelector(`input[name='checkAll']`)
    const checkSingle = checkboxMulti.querySelectorAll(`input[name='ids']`)
    checkAll.addEventListener('click', () => {
        if (checkAll.checked) {
            checkSingle.forEach(checkbox => {
                checkbox.checked = true;
            })
        }
        else {
            checkSingle.forEach(checkbox => {
                checkbox.checked = false;
            })
        }
    })
    checkSingle.forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            const countChecked = checkboxMulti.querySelectorAll(`input[name='ids']:checked`).length
            const countAll = checkSingle.length;
            if (countChecked === countAll) {
                checkAll.checked = true;
            } else {
                checkAll.checked = false;
            }

        })
    })
}

// End Checkbox Multi Status
// Form Change Multi Status
const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti) {
    formChangeMulti.addEventListener('submit', e => {
        if (e.target.elements.type.value === 'delete-all') {
            const isConfirm = confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm đã chọn?');
            if (!isConfirm) {
                e.preventDefault();
                return;
            }
        } else if (e.target.elements.type.value === '') {
            e.preventDefault();
            alert('Vui lòng chọn hành động để thực hiện');
            return;
        }

        const checkList = checkboxMulti.querySelectorAll(`input[name='ids']:checked`)
        const idList = [];
        checkList.forEach(checkbox => {
            const id = checkbox.value;
            if (e.target.elements.type.value === 'change-position')
            {
                const position = checkbox.closest('tr').querySelector(`input[name='position']`).value;
                idList.push(`${id}-${position}`);

            } else {
                idList.push(id);
            }
        })
        if (idList.length === 0){
            e.preventDefault();
            alert('Vui lòng chọn ít nhất một sản phẩm để thay đổi trạng thái');
            return;
        }
        const ids = formChangeMulti.querySelector(`input[name='ids']`);
        ids.value = idList.join(',');
    })
}
// End Form Change Multi Status


// Show Alert Message

const showAlert = document.querySelector('[show-alert]');
if(showAlert) {
    const dataTime = parseInt(showAlert.getAttribute('data-time'));
    setTimeout( () => {
        showAlert.classList.add('alert-hidden');
    },dataTime)
    const closeAlert = showAlert.querySelector('[close-alert]')
    if (closeAlert){
        closeAlert.addEventListener('click', () => {
            showAlert.classList.add('alert-hidden');
        })
    }
}

// End Show Alert Message

// Show Image Preview
const uploadImage = document.querySelector('[upload-image]');
const uploadImageInput = document.querySelector('[upload-image-input]');
const uploadImageClear = document.querySelector('[upload-image-clear]');
const imagePreview = document.querySelector('[upload-image-preview]');
if (uploadImage && uploadImageInput && uploadImageClear) {
    uploadImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const imagePreview = document.querySelector('[upload-image-preview]');
            const imageUrl = URL.createObjectURL(file);
            imagePreview.src = imageUrl;
            uploadImageClear.classList.remove('d-none');
        }
    })
    uploadImageClear.addEventListener('click', () => {
        uploadImageInput.value = '';
        imagePreview.src = '';
        uploadImageClear.classList.add('d-none');
    })
}

// End Show Image Preview

// Sort 
const sort = document.querySelector('[sort]');
if (sort) {
    const sortSelect = sort.querySelector('[sort-select]');
    const sortClear = sort.querySelector('[sort-clear]');
    const url = new URL(window.location.href);
    sortSelect.addEventListener('change', (e) => {

        const [sortKey, sortValue] = e.target.value.split('-');
        if (sortKey && sortValue){
            url.searchParams.set('sortKey', sortKey);
            url.searchParams.set('sortValue', sortValue);
        }else {
            url.searchParams.delete('sortKey');
            url.searchParams.delete('sortValue');
        }
        window.location.href = url.href;
    })
    sortClear.addEventListener('click', () => {
        url.searchParams.delete('sortKey');
        url.searchParams.delete('sortValue');
        window.location.href = url.href;
    })
    const sortKey = url.searchParams.get('sortKey');
    const sortValue = url.searchParams.get('sortValue');
    if (sortKey && sortValue ) {
        const key = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value='${key}']`);
        if (optionSelected) {
            optionSelected.selected = true;
        }
    } 

}

// Visible Password
const input = document.getElementById('password');
const icon = document.getElementById('pwIcon');
const toggleBtn = document.getElementById('togglePassword');
if(input && icon && toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        if(input.type === 'password'){
            input.type = 'text';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        } else {
            input.type = 'password';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        }
    });
}

