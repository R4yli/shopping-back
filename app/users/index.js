const express = require("express");
const userRouter = express.Router();
const userController = require("./controllers/usersController");
const { verifyToken } = require("../../middlewares/authMiddleware");

// client
userRouter.get("/users", [verifyToken], userController.getUsers);

// auth
userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);
userRouter.post("/refresh-token", userController.refreshToken);

// userLists
userRouter.post("/users/share-list", [verifyToken], userController.shareList);

module.exports = userRouter;
