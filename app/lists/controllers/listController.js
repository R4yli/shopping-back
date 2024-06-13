const { List, UserList, ListItem } = require("../../../models");

exports.deleteList = async (req, res) => {
	const { id } = req.params;

	try {
		const list = await List.findOne({ where: { id: id } });

		if (!list) {
			return res.status(404).json({ message: "Lista no encontrada" });
		}

		await UserList.destroy({ where: { listId: id } });
		await ListItem.destroy({ where: { listId: id } });

		await List.destroy({ where: { id: id } });


		return res.status(200).json({ message: "Lista eliminada" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error deleting list" });
	}
};

exports.getList = async (req, res) => {
	const { id } = req.params;

	try {
		const list = await List.findOne({ where: { id: id }, include: ['items'], order: [[{model: ListItem, as: 'items'}, 'createdAt', 'ASC']] });

		if (!list) {
			return res.status(404).json({ message: "Lista no encontrada" });
		}

		return res.status(200).json(list);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error getting list" });
	}
};

exports.updateList = async (req, res) => {
	const { title, status } = req.body;

	if (!title && !status) {
		return res.status(400).json({ message: "Title and status are required" });
	}

	try {
		const listId = req.params.id;
		const listToUpdate = await List.findByPk(listId, { include: ['items'] });

		if (!listToUpdate) {
			return res.status(404).json({ message: "List not found" });
		}

		let allIsBought = false;
		if (listToUpdate.items.every((item) => item.status === "Comprado")) {
			allIsBought = true;
		}

		listToUpdate.title = title || listToUpdate.title;
		listToUpdate.status = allIsBought ? "Completada" : status || listToUpdate.status;

		await listToUpdate.save();


		if (status === "Completada" && !allIsBought) {
			await ListItem.update({ status: "Comprado" }, { where: { listId } });
		}

		return res.status(200).json(listToUpdate);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error updating list" });
	}
};

exports.fetchLists = async (req, res) => {
	try {
		const userLists = await UserList.findAll({ where: { userId: req.userId }, include: [{model: List, as: 'list', include: ['items']}]});
		
		const lists = userLists.map((userList) => userList.list);

		return res.status(200).json(lists);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error fetching lists" });
	}
};

exports.createList = async (req, res) => {
	const { title } = req.body;

	if (!title) {
		return res.status(400).json({ message: "Title is required" });
	}

	try {
		const list = await List.create({
			title,
		});

		await UserList.create({
			userId: req.userId,
			listId: list.id,
		});
		

		return res.status(201).json(list);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error creating list" });
	}
};

exports.getListsPaginated = async (req, res) => {
	const { page = 1, perPage = 10 } = req.query;

	try {
		const { count, rows } = await UserList.findAndCountAll({
			where: { userId: req.userId },
			include: [{model: List, as: 'list', include: ['items']}],
			limit: perPage,
			offset: (page - 1) * perPage,
			order: [
				[{model: List, as: 'list'}, 'updatedAt', 'DESC'],
				[{model: List, as: 'list', include: ['items']}, {model: ListItem, as: 'items'}, 'createdAt', 'ASC']
			]
		});

		const lists = rows.map((userList) => userList.list);

		const response = {
			data: lists,
			total: count,
			pageCount: Math.ceil(count / perPage),
			page: +page,
			perPage: +perPage,
			hasNextPage: Math.ceil(count / perPage) > +page,
		};

		return res.status(200).json(response);
		
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error fetching lists" });
	}
}