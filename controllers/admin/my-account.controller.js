const md5 = require('md5');
const systemConfig = require('../../config/system');
const Account = require('../../models/account.model');
// [GET] /admin/my-account
module.exports.index = async (req, res) => {
    res.render('admin/pages/my-account', {
        title: 'Tài Khoản Của Tôi',
    });
}

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render('admin/pages/my-account/edit', {
        title: 'Chỉnh Sửa Tài Khoản Của Tôi',
    });
}

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    const emailExists = await Account.findOne(
    { 
        _id: { $ne: res.locals.user._id },
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
    await Account.updateOne({_id: res.locals.user._id}, req.body);
    req.flash('success', 'Cập nhật thành công');
    res.redirect(req.get('Referrer') || '/');
}