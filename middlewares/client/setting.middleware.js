const SettingGeneral = require('../../models/settings-general.model');
module.exports.general = async (req, res, next) => {
    const settingGeneral = await SettingGeneral.findOne({});
    res.locals.settingGeneral = settingGeneral;
    next();
}