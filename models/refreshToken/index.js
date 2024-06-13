const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config");
const { v4: uuidv4 } = require("uuid");

const RefreshToken = sequelize.define(
	"refreshToken",
	{
		token: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		expiration: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{ tableName: "refreshToken" }
);

RefreshToken.createToken = async (user) => {
	let expireAt = new Date();
	expireAt.setTime(expireAt.getTime() + process.env.REFRESH_EXPIRATION * 1000);

	let _token = uuidv4();
	const refreshToken = await RefreshToken.create({
		token: _token,
		userId: user.id,
		expiration: expireAt.getTime(),
	});

	return refreshToken.token;
};

RefreshToken.verifyExpiration = (token) => {
	return token.expiration.getTime() < new Date().getTime();
};

module.exports = { RefreshToken };