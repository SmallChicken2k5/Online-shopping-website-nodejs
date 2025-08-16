const Roles = require('../../models/roles.model');
const systemConfig = require('../../config/system');
// [GET] /admin/roles
module.exports.index = async (req,res) => {
    let find = {
        deleted: false,
    }
    const record = await Roles.find(find);

    res.render('admin/pages/roles/index', {
        title: 'Nhóm quyền',
        records: record,
    });
}

// [GET] /admin/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/roles/create', {
        title: 'Thêm mới nhóm quyền',
    });
}

// [POST] /admin/create
module.exports.createPost = async (req, res) => {
    const record = new Roles(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
};