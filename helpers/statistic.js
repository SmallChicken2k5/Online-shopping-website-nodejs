module.exports.multi = async (modelMap) => {
    const result = {};
    for (const [key, Model] of Object.entries(modelMap)) {
        const total = await Model.countDocuments();
        const active = await Model.countDocuments({ status: 'active' });
        const inactive = await Model.countDocuments({ status: 'inactive' });
        result[key] = { total, active, inactive };
    }
    return result;
}