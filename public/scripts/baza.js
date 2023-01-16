const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt22", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//import modela
db.nastavnici = sequelize.import(__dirname + "/nastavnici.js");
db.predmeti = sequelize.import(__dirname + "/predmeti.js");
db.prisustva = sequelize.import(__dirname + "/prisustva.js");
db.student = sequelize.import(__dirname + "/student.js");

/*//relacije
// Veza 1-n vise knjiga se moze nalaziti u biblioteci
db.biblioteka.hasMany(db.knjiga,{as:'knjigeBiblioteke'});

// Veza n-m autor moze imati vise knjiga, a knjiga vise autora
db.autorKnjiga=db.knjiga.belongsToMany(db.autor,{as:'autori',through:'autor_knjiga',foreignKey:'knjigaId'});
db.autor.belongsToMany(db.knjiga,{as:'knjige',through:'autor_knjiga',foreignKey:'autorId'});*/

module.exports = db;
