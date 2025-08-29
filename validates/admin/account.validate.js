const systemConfig = require('../../config/system')
module.exports.createPost = (req ,res , next) => {
    if (!req.body.fullName) {
        req.flash('error', 'Họ và tên không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!req.body.email) {
        req.flash('error', 'Email không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!req.body.password) {
        req.flash('error', 'Mật khẩu không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    // if (!req.body.avatar) {
    //     req.flash('error', 'Ảnh đại diện không được để trống');
    //     return res.redirect(systemConfig.prefixAdmin + '/accounts/create');
    // }
    next();
}

module.exports.editPatch = (req ,res , next) => {
    if (!req.body.fullName) {
        req.flash('error', 'Họ và tên không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!req.body.email) {
        req.flash('error', 'Email không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }

    next();
}