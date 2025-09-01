const systemConfig = require('../../config/system');
const Account = require('../../models/account.model');
module.exports.requireAuth = async (req, res ,next) => {
    if (!req.cookies.token) {
        req.flash('error', 'Bạn cần đăng nhập để truy cập trang này');
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
        const user = await Account.findOne(
            { 
                token: req.cookies.token,
                deleted : false
            }
        );
        if (!user) {
            req.flash('error', 'Bạn cần đăng nhập để truy cập trang này');
            return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        }
    }
    next();
}
