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
        const checkList = checkboxMulti.querySelectorAll(`input[name='ids']:checked`)
        const idList = [];
        checkList.forEach(checkbox => {
            idList.push(checkbox.value);
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
