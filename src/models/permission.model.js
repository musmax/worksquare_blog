module.exports = (sequelize, dataType) => {
  const permission = sequelize.define('permission', {
    name: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    value: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    groupName: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    description: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
  });

  return permission;
};
