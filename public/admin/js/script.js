// Start Button status 
const buttonStatus = document.querySelectorAll('[button-status]');
if (buttonStatus.length > 0){
    buttonStatus.forEach( item => {
        item.addEventListener('click', () => {
            const status = item.getAttribute('button-status');
            const url = new URL(window.location.href);
            if (status){
                url.searchParams.set('status',status);
            }
            else {
                url.searchParams.delete('status');
            }
            window.location.href = url.href;
        })
    })
}
// End Button status

// Form Search

const formSearch = document.querySelector('#form-search');
if (formSearch) {
    formSearch.addEventListener('submit' , e => {
        e.preventDefault();
        const url = new URL(window.location.href);
        const keyword = e.target.elements.keyword.value;
        if (keyword){
            url.searchParams.set('keyword', keyword);
        } else {
            url.searchParams.delete('keyword');
        }
        window.location.href = url.href;
    })
}

// End Form Search

// Pagination

const buttonPagination = document.querySelectorAll('[button-pagination]');
if (buttonPagination){
    buttonPagination.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('button-pagination');
            const url = new URL(window.location.href);
            url.searchParams.set('page',page);
            window.location.href = url.href;
        })
    })
}

// End Pagination