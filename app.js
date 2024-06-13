require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./config");
const userRouter = require("./app/users");
const listRouter = require("./app/lists");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("Hello world!");
});

app.use("/", userRouter);
app.use("/", listRouter);
app.use("/public", express.static("public"));

sequelize
	.authenticate()
	.then(() => {
		console.info("Connection success");
		return sequelize.sync({ alter: true });
	})
	.then(() => {
		console.info("Sync models");
		app.listen(port, () => {
			console.log(`Server listen on http://localhost:${port}`);
		});
	})
	.catch((error) => {
		console.error("Connection fail", error);
	});
