// Permissions
const tablePermissions = document.querySelector('[table-permissions]')
const buttonSubmit = document.querySelector('[button-submit]')
if (tablePermissions && buttonSubmit) {
    buttonSubmit.addEventListener('click' , () => {
        let permissions = [];
        // {
        //     id: id,
        //     permission: [permission],
        // }
        const checkboxes = tablePermissions.querySelectorAll('[data-name]');
        const Roles = tablePermissions.querySelectorAll('[role-id]');
        Roles.forEach((role) => {
            permissions.push({
                id: role.getAttribute('role-id'),
                permission: [],
            });
        });
        const numberOfRoles = permissions.length;
        checkboxes.forEach((row,index) => {
            if (row.checked){
                const permission = row.getAttribute('data-name');
                permissions[index % numberOfRoles].permission.push(permission);
            }
        })
        // console.log(permissions);
        const formChangePermissions = document.getElementById('form-change-permissions');
        if (formChangePermissions) {
            const dataInput = formChangePermissions.querySelector('input[name="permissions"]');
            if (dataInput) {
                dataInput.value = JSON.stringify(permissions);
            }
            formChangePermissions.submit();
        }
    })
}