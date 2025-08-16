const Roles = require('../../models/roles.model');
const systemConfig = require('../../config/system');
// [GET] /admin/roles
module.exports.index = async (req, res) => {
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

// [GET] /admin/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const find = {
            _id: id,
            deleted: false
        }
        const record = await Roles.findOne(find);
        res.render('admin/pages/roles/edit', {
            title: 'Chỉnh sửa nhóm quyền',
            record: record,
        });
    } catch (error) {
        req.flash('error', 'Không tìm thấy nhóm quyền');
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }

}

// [Patch] /admin/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    const find = {
        _id: id,
        deleted: false
    }
    const record = await Roles.findOne(find);
    if (!record) {
        req.flash('error', 'Không tìm thấy nhóm quyền');
        return res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }

    // Cập nhật thông tin nhóm quyền
    record.title = req.body.title;
    record.description = req.body.description;
    await record.save();

    req.flash('success', 'Cập nhật nhóm quyền thành công');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}