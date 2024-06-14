const { Sequelize } = require("sequelize");

const database = "railway";
const username = "postgres";
const password = process.env.DATABASE_PASSWORD;
const host = "viaduct.proxy.rlwy.net";
const port = "35337";

const sequelize = new Sequelize(database, username, password, {
	host: host,
	port: port,
	dialect: "postgresql",
	logging: true,
});

module.exports = {
	sequelize,
};
