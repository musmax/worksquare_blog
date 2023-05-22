const Sequelize = require('sequelize');
const { sequelize } = require('../config/config');
const logger = require('../config/logger');

const sequelizeInstance = new Sequelize(sequelize.url);
const db = {};

sequelizeInstance
  .authenticate()
  .then(() => logger.info('DB connected'))
  .catch((err) => {
    logger.error(err);
  });

db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

// import models here below
db.user = require('./user.model')(sequelizeInstance, Sequelize);
db.tokens = require('./token.model')(sequelizeInstance, Sequelize);
db.roles = require('./role.model')(sequelizeInstance, Sequelize);
db.permission = require('./permission.model')(sequelizeInstance, Sequelize);
db.variable = require('./variables.model')(sequelizeInstance, Sequelize);
db.message_template = require('./message_template.model')(sequelizeInstance, Sequelize);
db.message = require('./message.model')(sequelizeInstance, Sequelize);
db.blog = require('./blog.model')(sequelizeInstance, Sequelize);

//= ==============================
// Define all relationships here below
//= ==============================

// User - Token
db.user.hasOne(db.tokens, { foreignKey: 'userId', as: 'userToken' });
db.tokens.belongsTo(db.user, { foreignKey: 'userId', as: 'userToken' });

// Role - Permission
db.roles.belongsToMany(db.permission, { through: 'role_permisson' });
db.permission.belongsToMany(db.roles, { through: 'role_permisson' });

// User - Role
db.user.belongsToMany(db.roles, { through: 'user_role' });
db.roles.belongsToMany(db.user, { through: 'user_role' });

// Message Template - Variable
db.message_template.belongsToMany(db.variable, { through: 'message_variable', onDelete: 'cascade' });
db.variable.belongsToMany(db.message_template, { through: 'message_variable' });

// User - Message
db.user.hasMany(db.message, { foreignKey: 'senderId', as: 'sender' });
db.message.belongsTo(db.user, { foreignKey: 'senderId', as: 'sender' });

// User - Message
db.user.hasMany(db.message, { foreignKey: 'receiverId', as: 'receiver' });
db.message.belongsTo(db.user, { foreignKey: 'receiverId', as: 'receiver' });

// User - Blog
db.user.hasMany(db.blog, { foreignKey: 'authorId', as: 'userBlog' });
db.blog.belongsTo(db.user, { foreignKey: 'authorId', as: 'userBlog' });

module.exports = {
  db,
};
