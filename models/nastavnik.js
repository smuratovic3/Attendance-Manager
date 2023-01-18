const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const Nastavnik = sequelize.define(
    "nastavnik",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: Sequelize.STRING,
      password_hash: Sequelize.STRING,
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  return Nastavnik;
};
