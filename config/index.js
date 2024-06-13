const { Sequelize } = require("sequelize");

const database = "shopping_list";
const username = "postgres";
const password = "1234";
const host = "localhost";

const sequelize = new Sequelize(database, username, password, {
	host: host,
	dialect: "postgres",
	logging: true,
});

module.exports = {
	sequelize,
};
