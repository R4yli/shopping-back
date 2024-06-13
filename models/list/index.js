const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config");

const LIST_STATUS = {
  PENDING: "Pendiente",
  COMPLETE: "Completada",
};

const List = sequelize.define(
  "list",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(Object.values(LIST_STATUS)),
      defaultValue: LIST_STATUS.PENDING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "list" }
);

module.exports = { List };