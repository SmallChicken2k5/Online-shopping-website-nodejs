module.exports = (query) => {
    const buttonStatus = [
        {
            name: 'Tất cả',
            class:'btn btn-sm btn-outline-success',
            status: '',
        },
        {
            name: 'Hoạt động',
            class:'btn btn-sm btn-outline-success ms-1',
            status: 'active',
        },
        {
            name: 'Dừng hoạt động',
            class:'btn btn-sm btn-outline-success ms-1',
            status: 'inactive',
        }
    ]
    buttonStatus.forEach(item => {
        if (query.status === item.status || (item.status === '' && !query.status)){
            item.class += ' active'
        }
    })  

    return buttonStatus;
}