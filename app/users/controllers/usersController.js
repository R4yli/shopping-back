const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, List, UserList, RefreshToken } = require("../../../models");

exports.getUsers = async (req, res) => {
	try {
		const users = await User.findAll({
			include: [
				{
					model: List,
					as: "lists",
					attributes: ["id", "title", "createdAt"],
				},
			],
			attributes: { exclude: ["password"] },
		});
		return res.json({ users });
	} catch (error) {
		console.log("Error", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

exports.registerUser = async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body;

		if (!firstName || !lastName || !email || !password) {
			return res.status(400).json({
				message: "Is required first name or last name or email or password",
			});
		}

		const userExist = await User.findOne({ where: { email } });

		if (userExist) {
			return res.status(400).json({
				message: "The email is duplicated.",
			});
		}

		const newUser = await User.create({
			firstName,
			lastName,
			email,
			password: await bcrypt.hash(password, 10),
		});

		const userWithoutPassword = {
			id: newUser.id,
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			email: newUser.email,
		};

		return res.status(201).json(userWithoutPassword);
	} catch (error) {
		return res.status(500).json({ message: "Error in register user" });
	}
};

exports.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: "Password or email required",
			});
		}

		const userExist = await User.findOne({ where: { email } });

		if (!userExist) {
			console.log(userExist);
			return res.status(400).json({
				message: "The email is not exist.",
			});
		}

		const passwordIsValid = await bcrypt.compare(password, userExist.password);

		if (!passwordIsValid) {
			return res.status(400).json({
				message: "Password is not valid",
			});
		}

		const token = jwt.sign({ id: userExist.id, email: userExist.email }, process.env.JWT_SECRET, {
			algorithm: "HS256",
			allowInsecureKeySizes: true,
			expiresIn: process.env.JWT_EXPIRATION,
		});

		await RefreshToken.destroy({ where: { userId: userExist.id } });
		const refreshToken = await RefreshToken.createToken(userExist);

		return res.status(200).json({
			id: userExist.id,
			email: userExist.email,
			accessToken: token,
			refreshToken,
		});
	} catch (error) {
		return res.status(500).json({ message: "Error in registering user" });
	}
};

exports.refreshToken = async (req, res) => {
	const { refreshToken } = req.body;

	if (!refreshToken) {
		return res.status(404).json({
			message: "Refresh Token is required",
		});
	}

	try {
		let refresh = await RefreshToken.findOne({
			where: { token: refreshToken },
		});

		if (!refresh) {
			return res.status(404).json({
				message: "Refresh Token is not in the database",
			});
		}

		if (RefreshToken.verifyExpiration(refresh)) {
			RefreshToken.destroy({ where: { id: refresh.id } });

			res.status(403).json({
				message: "Refresh token was expired. Please make a new signin request",
			});
			return;
		}

		const user = await refresh.getUser();

		let newAccessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
			algorithm: "HS256",
			allowInsecureKeySizes: true,
			expiresIn: process.env.JWT_EXPIRATION,
		});

		return res.status(200).json({ accessToken: newAccessToken, refreshToken: refresh.token });
	} catch (error) {
		return res.status(500).json({ message: "Error refreshing token" });
	}
};

exports.shareList = async (req, res) => {
	const { email, listId } = req.body;

	if (!email || !listId) {
		return res.status(400).json({ message: "El correo es requerido" });
	}

	try {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}

		const list = await List.findByPk(listId, { include: ['items'] });

		if (!list) {
			return res.status(404).json({ message: "Lista no encontrada" });
		}

		const newList = await List.create({ title: list.title, userId: user.id});

		list.items.forEach(async (item) => {
			await newList.createItem({ name: item.name, quantity: item.quantity, listId: newList.id });
		});

		await UserList.create({ userId: user.id, listId: newList.id });


		return res.status(200).json({ message: "List shared" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error sharing list" });
	}
}