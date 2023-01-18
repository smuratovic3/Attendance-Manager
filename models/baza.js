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
baza.student = require("./student.js")(sequelize);
baza.prisustva = require("./prisustva.js")(sequelize);

baza.nastavnik.hasMany(baza.predmeti, {
  as: "predmetiNastavnik",
  foreignKey: "nastavnikId",
});

// student predmeti 1 - n
baza.predmeti.hasMany(baza.student, { as: "studentPredmeti" });

//prisustva
baza.predmeti.hasMany(baza.prisustva, { as: "predmetPrisustva" });

baza.sequelize.sync({ force: false });

async function punjenjeBaze() {
  await baza.nastavnik.create({
    username: "a",
    password_hash:
      "$2b$10$alzqW1AwkdWUtnpJ.60bYeTH2D6lIMAjp84kRpahnL/PQ2nobvjo.",
  });
}
punjenjeBaze();
module.exports = baza;
