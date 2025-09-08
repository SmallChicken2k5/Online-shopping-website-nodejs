const systemConfig = require('../../config/system');
const User = require('../../models/user.model'); 
module.exports.requireAuth = async (req, res ,next) => {
    if (!req.cookies.tokenUser) {
        req.flash('error', 'Bạn cần đăng nhập để truy cập trang này');
        return res.redirect(`/user/login`);
    } else {
        const user = await User.findOne(
            { 
                tokenUser: req.cookies.tokenUser,
                deleted : false
            }
        ).select(
            '-password'
        );
        if (!user) {
            req.flash('error', 'Bạn cần đăng nhập để truy cập trang này');
            return res.redirect(`/user/login`);
        }
    }
    next();
}
