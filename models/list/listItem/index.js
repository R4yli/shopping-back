const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config");

const ITEM_STATUS = {
  PENDING: 'Pendiente',
  BOUGHT: 'Comprado',
};

const ListItem = sequelize.define(
  "listItem",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(Object.values(ITEM_STATUS)),
      defaultValue: ITEM_STATUS.PENDING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "listItem" }
);

module.exports = { ListItem };