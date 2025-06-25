module.exports.dashboard = async (req, res) => {
    res.render('admin/pages/dashboard', {
        title: 'Dashboard',
        message: 'Welcome to the Admin Dashboard'
    });
}