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

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req,res) => {
    const id = req.params.id;
    let find = {
        deleted: false,
        _id: id,
    };
    const roles = await Role.find({deleted: false});
    const records = await Account.findOne(find);
    res.render('admin/pages/accounts/edit',{
        title: 'Chỉnh sửa',
        account: records,
        roles: roles
    })
}

module.exports.editPatch = async (req,res) => {
    const emailExists = await Account.findOne(
    { 
        _id: { $ne: req.params.id },
        email: req.body.email,
        deleted: false
    });
    if (emailExists) {
        req.flash('error', 'Email đã tồn tại');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (req.body.password) {
        req.body.password = md5(req.body.password);
    }else {
        delete req.body.password;
    }
    await Account.updateOne({_id: req.params.id}, req.body);
    req.flash('success', 'Cập nhật thành công');
    res.redirect(req.get('Referrer') || '/');
}