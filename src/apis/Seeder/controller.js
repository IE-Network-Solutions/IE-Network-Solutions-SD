const { getConnection } = require('typeorm');
const AppError = require('../../../utils/apperror');
const Permission = require('../../models/Permission');
const { getAllPermissions } = require('../permissions/dal');
const PermissionSeederDAl = require('./dal');

exports.seedPermissions = async (req, res, next) => {

    await PermissionSeederDAl.permissionSeeder();
    try {
        res.status(200).json({
            status: 200,
            message: "Data inserted successfully",
            data: await getAllPermissions()
        })
    } catch (error) {
        return next(new AppError("Permission must be Unique", 400));
    }
}
