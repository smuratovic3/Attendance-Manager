const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt22", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});
const baza = {};

baza.Sequelize = Sequelize;
baza.sequelize = sequelize;

//import modela
baza.nastavnik = sequelize.import(__dirname + "/nastavnik.js");
baza.predmeti = sequelize.import(__dirname + "/predmeti.js");
baza.prisustva = sequelize.import(__dirname + "/prisustva.js");
baza.student = sequelize.import(__dirname + "/student.js");

//relacije nastavnici - predmeti
// Veza 1-n jedan nastavnik moze predavati vise predmeta
baza.nastavnik.hasMany(baza.predmeti, { as: "predmetiNastavnik" });

/*// Veza n-m autor moze imati vise knjiga, a knjiga vise autora
db.autorKnjiga=db.knjiga.belongsToMany(db.autor,{as:'autori',through:'autor_knjiga',foreignKey:'knjigaId'});
db.autor.belongsToMany(db.knjiga,{as:'knjige',through:'autor_knjiga',foreignKey:'autorId'});*/

module.exports = db;
