const SettingGeneral = require('../../models/settings-general.model')
//[GET] /settings/general
module.exports.general = async (req, res) => {
    const setting = await SettingGeneral.findOne({});
    res.render('admin/pages/settings/general', {
        title: 'Cài đặt chung',
        setting: setting
    })
}

module.exports.generalPatch = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});
    if (settingGeneral){
        await SettingGeneral.updateOne({
            _id : settingGeneral.id
        }, req.body);
    } else {
        const record = new SettingGeneral(req.body);
        await record.save();
    }

    req.flash('success', 'Cập nhật cài đặt chung thành công!');
    res.redirect('/admin/settings/general');
}