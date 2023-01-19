const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const Predmet = sequelize.define(
    "predmet",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      predmet: Sequelize.STRING,
      brojPredavanjaSedmicno: Sequelize.INTEGER,
      brojVjezbiSedmicno: Sequelize.INTEGER,
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  return Predmet;
};
