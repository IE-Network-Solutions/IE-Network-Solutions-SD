const uuid = require("uuid");

exports.generateUUID = async () => {
    return uuid.v4();
}