const Sequelize = require("sequelize");

const sequelize = new Sequelize("wt22", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  sync: true,
});
const baza = {};
baza.sequelize = sequelize;

//import modela
baza.predmeti = require("./predmeti.js")(sequelize);
baza.nastavnik = require("./nastavnik.js")(sequelize);

//relacije nastavnici - predmeti
// Veza 1-n jedan nastavnik moze predavati vise predmeta
baza.nastavnik.hasMany(baza.predmeti, { as: "predmetiNastavnik" });

baza.sequelize.sync({ force: true });

module.exports = baza;
