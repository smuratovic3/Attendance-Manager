const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const Prisustva = sequelize.define(
    "prisustva",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sedmica: Sequelize.INTEGER,
      predavanja: Sequelize.INTEGER,
      vjezbe: Sequelize.INTEGER,
      indeks: Sequelize.INTEGER,
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  return Prisustva;
};
