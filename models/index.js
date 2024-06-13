const { User } = require("./user");
const { List } = require("./list");
const { RefreshToken } = require("./refreshToken");
const { ListItem } = require("./list/listItem");
const { UserList } = require("./user/userList");

// Associations
ListItem.belongsTo(List, {
	foreignKey: "listId",
});
List.hasMany(ListItem, { as: "items", foreignKey: "listId", onDelete: "CASCADE"});

User.hasMany(UserList, { as: "userLists", foreignKey: "userId", onDelete: "CASCADE"});
UserList.belongsTo(User, {
	foreignKey: "userId",
});

UserList.hasMany(List, { as: "list", foreignKey: "id", onDelete: "CASCADE"});

List.hasMany(UserList, { as: "userLists", foreignKey: "listId", onDelete: "CASCADE"});
UserList.belongsTo(List, {
	foreignKey: "listId",
});

RefreshToken.belongsTo(User, {
	foreignKey: "userId",
});


// Export models
module.exports = {
	User,
	List,
	UserList,
	ListItem,
	RefreshToken,
};
