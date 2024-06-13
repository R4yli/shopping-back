const express = require("express");
const listRouter = express.Router();
const listController = require("./controllers/listController");
const listItemController = require("./controllers/listItem.controller");
const { verifyToken } = require("../../middlewares/authMiddleware");

const baseRoute = "/list";

// List routes
listRouter.post(baseRoute, [verifyToken], listController.createList);
listRouter.get(baseRoute, [verifyToken], listController.fetchLists);
listRouter.get(`${baseRoute}-paginated`, [verifyToken], listController.getListsPaginated);
listRouter.put(`${baseRoute}/:id`, [verifyToken], listController.updateList);
listRouter.delete(`${baseRoute}/:id`, [verifyToken], listController.deleteList);
listRouter.get(`${baseRoute}/:id`, [verifyToken], listController.getList);

// Item routes
listRouter.post(`${baseRoute}/:listId/item`, [verifyToken], listItemController.create);
listRouter.put(`${baseRoute}/:listId/item/:id`, [verifyToken], listItemController.update);
listRouter.delete(`${baseRoute}/:listId/item/:id`, [verifyToken], listItemController.delete);
listRouter.get(`${baseRoute}/:listId/items`, [verifyToken], listItemController.getAllByList);

module.exports = listRouter;
