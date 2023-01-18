const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const Student = sequelize.define(
    "student",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ime: Sequelize.STRING,
      indeks: Sequelize.INTEGER,
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  return Student;
};
