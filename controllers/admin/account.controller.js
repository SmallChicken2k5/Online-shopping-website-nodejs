const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const systemConfig = require('../../config/system')
const md5 = require('md5')
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }
    const accounts = await Account
        .find(find)
        .select('-password -token');
    for (const account of accounts) {
        const roleTitle = await Role.findOne({
            _id: account.role_id,
            deleted: false,
        });
        account.roleTitle = roleTitle ? roleTitle.title : '';
    }
    res.render('admin/pages/accounts/index', {
        title: 'Danh sách tài khoản',
        records: accounts,
    });
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }
    const roles = await Role.find(find);
    res.render('admin/pages/accounts/create', {
        title: 'Tạo tài khoản',
        roles: roles,
    });
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExists = await Account.findOne(
        { 
            email: req.body.email,
            deleted: false
        });
    if (emailExists) {
        req.flash('error', 'Email đã tồn tại');
        return res.redirect(systemConfig.prefixAdmin + '/accounts/create');
    }
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    res.redirect(systemConfig.prefixAdmin + '/accounts');
}