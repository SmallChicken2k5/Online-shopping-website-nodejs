const User = require('../../models/user.model');
const md5 = require('md5');
// [GET] /user/register
module.exports.register = (req , res) => {
    res.render('client/pages/user/register' , {
        title: 'Đăng ký tài khoản'
    });
}


// [POST] /user/register
module.exports.registerPost = async (req , res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })
    if (existEmail) {
        req.flash('error', 'Email đã tồn tại');
        return res.redirect(req.get('Referrer') || '/');
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();

    res.cookie('tokenUser', user.tokenUser);
    res.redirect('/');
}