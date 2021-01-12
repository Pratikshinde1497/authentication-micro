module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("guser", {
    googleId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    displayName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false
    },
    provider: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      default: Date.now()
    } 
  });

  return User;
};