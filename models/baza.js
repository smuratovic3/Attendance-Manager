const Sequelize = require("sequelize");

const sequelize = new Sequelize("wt22", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  sync: true,
});
const baza = {};
baza.sequelize = sequelize;
baza.Sequelize = Sequelize;
//import modela
baza.predmet = require("./predmet.js")(sequelize);
baza.nastavnik = require("./nastavnik.js")(sequelize);
baza.student = require("./student.js")(sequelize);
baza.prisustvo = require("./prisustvo.js")(sequelize);

baza.nastavnik.hasMany(baza.predmet, {
  as: "predmetiNastavnik",
  foreignKey: "nastavnikId",
});

// student predmeti 1 - n
baza.predmet.hasMany(baza.student, { as: "studentPredmeti" });

//prisustva
baza.predmet.hasMany(baza.prisustvo, { as: "predmetPrisustva" });

setTimeout(() => {
  baza.nastavnik.sync({ force: true });
}, 200);
setTimeout(() => {
  baza.predmet.sync({ force: true });
}, 400);

setTimeout(() => {
  baza.student.sync({ force: true });
}, 600);

setTimeout(() => {
  baza.prisustvo.sync({ force: true });
}, 800);

async function punjenjeBaze() {
  await baza.nastavnik.create({
    username: "a",
    password_hash:
      "$2b$10$alzqW1AwkdWUtnpJ.60bYeTH2D6lIMAjp84kRpahnL/PQ2nobvjo.",
  });

  await baza.predmet.create({
    predmet: "Web tehnologije",
    brojPredavanjaSedmicno: 3,
    brojVjezbiSedmicno: 1,
    nastavnikId: 1,
  });

  await baza.prisustvo.create({
    sedmica: 1,
    predavanja: 1,
    vjezbe: 1,
    indeks: 12345,
    predmetId: 1,
  });
  await baza.prisustvo.create({
    sedmica: 2,
    predavanja: 1,
    vjezbe: 1,
    indeks: 12345,
    predmetId: 1,
  });
  await baza.prisustvo.create({
    sedmica: 3,
    predavanja: 1,
    vjezbe: 1,
    indeks: 12345,
    predmetId: 1,
  });
  await baza.prisustvo.create({
    sedmica: 4,
    predavanja: 1,
    vjezbe: 1,
    indeks: 12345,
    predmetId: 1,
  });
  await baza.prisustvo.create({
    sedmica: 5,
    predavanja: 1,
    vjezbe: 1,
    indeks: 12345,
    predmetId: 1,
  });
  await baza.student.create({
    ime: "Neko Nekic",
    indeks: 12345,
    predmetId: 1,
  });
}
setTimeout(() => {
  punjenjeBaze();
}, 1000);

module.exports = baza;
