const { List, ListItem } = require("../../../models");

exports.create = async (req, res) => {
  const { name, quantity, status } = req.body;
  const { listId } = req.params;

  console.log({ name, quantity, status, listId })

  if (!name || (quantity !== 0 && !quantity) || !listId) {
    return res.status(400).json({ message: "ListId, name and quantity are required" });
  }

  try {
    const list = await List.findByPk(listId);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const listItem = await ListItem.create({
      listId,
      name,
      quantity,
      status
    });

    return res.status(201).json(listItem);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating list item" });
  }
}

exports.update = async (req, res) => {
  const { name, quantity, status } = req.body;
  const { listId, id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }

  try {
    const list = await List.findByPk(listId);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const listItem = await ListItem.findByPk(id);

    if (!listItem) {
      return res.status(404).json({ message: "List item not found" });
    }

    listItem.name = name || listItem.name;
    listItem.quantity = quantity || listItem.quantity;
    listItem.status = status || listItem.status;

    await listItem.save();

    const listItems = await ListItem.findAll({ where: { listId } });
    const allItemsBought = listItems.every((item) => item.status === "Comprado");

    if (allItemsBought) {
      list.status = "Completada";
      await list.save();
    } else {
      list.status = "Pendiente";
      await list.save();
    }

    return res.status(200).json(listItem);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating list item" });
  }
}

exports.delete = async (req, res) => {
  try {
    const listItem = await ListItem.findByPk(req.params.id);

    if (!listItem) {
      return res.status(404).json({ message: "List item not found" });
    }

    await listItem.destroy();

    return res.status(204).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting list item" });
  }
}

exports.getAllByList = async (req, res) => {
  try {
    const listItems = await ListItem.findAll({
      where: { listId: req.params.listId }, order: [
        ['createdAt', 'ASC'],
      ]
    });

    return res.status(200).json(listItems);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error getting list items" });
  }
}