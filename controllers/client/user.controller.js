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

// [GET] /user/login
module.exports.login = (req , res) => {
    res.render('client/pages/user/login' , {
        title: 'Đăng nhập tài khoản'
    });
}

// [POST] /user/login
module.exports.loginPost = async (req , res) => {
    const email = req.body.email;
    const password = md5(req.body.password);
    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        req.flash('error', 'Email không tồn tại');
        res.redirect(req.get('Referrer') || '/');
        return;
    }
    if (user.password !== password) {
        req.flash('error', 'Mật khẩu không đúng');
        res.redirect(req.get('Referrer') || '/');
        return;
    }
    if (user.status !== 'active') {
        req.flash('error', 'Tài khoản không hoạt động');
        res.redirect(req.get('Referrer') || '/');
        return;
    }
    res.cookie('tokenUser', user.tokenUser);
    res.redirect('/');
}