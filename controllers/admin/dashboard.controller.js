// [GET] /admin/dashboard
module.exports.dashboard = (req, res) => {
    res.render('admin/pages/dashboard', {
        title: 'Dashboard',
        message: 'Welcome to the Admin Dashboard'
    });
}