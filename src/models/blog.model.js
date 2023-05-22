module.exports = (sequelize, dataType) => {
    const blog = sequelize.define('blog', {
      title: {
        type: dataType.STRING,
        allowNull: false,
        trim: true,
      },
      content: {
        type: dataType.STRING,
        allowNull: false,
        trim: true,
      },
    });
  
    return blog;
  };