const validator = require('validator');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, dataType) => {
  const user = sequelize.define('user', {
    firstName: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    lastName: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    middleName: {
      type: dataType.STRING,
    },
    email: {
      type: dataType.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    gender: {
      type: dataType.ENUM,
      values: ['male', 'female'],
    },
    password: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
    },
    profileImage: {
      type: dataType.STRING,
      trim: true,
    },
    phoneNumber: {
      type: dataType.STRING,
      trim: true,
    },
    lastLogin: {
      type: dataType.DATE,
    },
    isVerified: {
      type: dataType.BOOLEAN,
      defaultValue: false,
    },
  });

  sequelizePaginate.paginate(user);

  return user;
};
