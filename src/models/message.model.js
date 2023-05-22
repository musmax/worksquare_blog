const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, dataType) => {
  const message = sequelize.define('message', {
    message: {
      type: dataType.STRING,
    },
  });

  sequelizePaginate.paginate(message);

  return message;
};
