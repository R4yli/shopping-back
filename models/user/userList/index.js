const { sequelize } = require("../../../config");

const UserList = sequelize.define("userLists", {}, { tableName: "userLists", timestamps: false});

module.exports = { UserList };