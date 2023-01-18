const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const Predmeti = sequelize.define(
    "predmeti",
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
  return Predmeti;
};
