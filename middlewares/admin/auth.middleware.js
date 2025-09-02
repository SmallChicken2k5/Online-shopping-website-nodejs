const systemConfig = require('../../config/system');
const Account = require('../../models/account.model');
const Role = require('../../models/role.model'); 
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
        ).select(
            '-password'
        );
        if (!user) {
            req.flash('error', 'Bạn cần đăng nhập để truy cập trang này');
            return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        }
        const role = await Role.findOne({
            _id : user.role_id,
            deleted: false,
        })
        res.locals.user = user;
        res.locals.role = role;
    }
    next();
}
