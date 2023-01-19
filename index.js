const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const nastavnici = require("./data/nastavnici.json");
const prisustva = require("./data/prisustva.json");
const session = require("express-session");
const bcrypt = require("bcrypt");
const fs = require("fs");
const baza = require("./models/baza");
const predmeti = require("./models/predmet");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/public/html")));
app.use(express.static(path.join(__dirname + "/public/css")));
app.use(express.static(path.join(__dirname + "/public/ikone")));
app.use(express.static(path.join(__dirname + "/public/scripts")));
app.use(
  // da naglasi da koristi sesija, tajni kljuc
  session({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
  })
);

baza.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.log(error);
    console.log("Error in establishing connection");
  });

app.post("/login/", async function (req, res) {
  try {
    const nastavnik = await baza.nastavnik.findOne({
      where: { username: req.body.username },
    });

    if (nastavnik) {
      const match = await bcrypt.compare(
        req.body.password,
        nastavnik.password_hash
      );
      if (match) {
        req.session.user = nastavnik.dataValues;
        res.status(200).json({ poruka: "Uspješna prijava" });
      } else {
        res.status(404).json({ poruka: "Neuspješna prijava" });
      }
    } else {
      res.status(404).json({ poruka: "Neuspješna prijava" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ poruka: "Greška prilikom prijave" });
  }
});

app.post("/logout/", function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(404).json({ poruka: "Ne radi nista" });
    } else {
      res.status(200).json({ poruka: "Radi sve" });
    }
  });
});

// get zahtjev za loginovanog nastavnika, ako nije loginovan poruka Nastavnik nije loginovan
app.get("/predmeti/", async (req, res) => {
  if (!req.session.user) {
    res.status(404).json({ greska: "Nastavnik nije loginovan" });
    console.log("poruka");
  } else {
    let korisnickoIme = req.session.user.username;

    try {
      let predmeti = await baza.predmet.findAll({
        where: {
          nastavnikId: req.session.user.id,
        },
      });
      predmeti = predmeti.map((p) => p.dataValues.predmet);

      res.status(200).json(predmeti);
    } catch (err) {
      console.log(err);
      res.status(500).json({ greska: "Greska prilikom dohvatanja predmeta" });
    }
  }
});

//get zahtjev za odgovarajucii predmet
app.get("/predmet/:naziv", async function (req, res) {
  try {
    let naziv = req.params.naziv;
    let predmet = await baza.predmet.findOne({ where: { predmet: naziv } });
    predmet = predmet.dataValues;
    const brojPredavanjaSedmicno = predmet.brojPredavanjaSedmicno;
    const brojVjezbiSedmicno = predmet.brojVjezbiSedmicno;
    if (!predmet) {
      res.status(404).json({ greska: "Predmet ne postoji" });
    } else {
      let prisustva = await baza.prisustvo.findAll({
        where: {
          predmetId: predmet.id,
        },
      });
      console.log(prisustva);
      let studenti = await baza.student.findAll({
        where: {
          predmetId: predmet.id,
        },
      });

      console.log(studenti);

      //određene informacije iz niza, uzimam i pravim novi niz
      prisustva = prisustva.map((p) => p.dataValues);
      studenti = studenti.map((p) => p.dataValues);
      studenti.forEach((element) => {
        element.index = element.indeks;
      });
      prisustva.forEach((element) => {
        element.index = element.indeks;
      });

      const rezultat = {
        studenti,
        prisustva,
        brojPredavanjaSedmicno,
        brojVjezbiSedmicno,
        predmet: predmet.predmet,
      };
      console.log(rezultat);
      res.status(200).json(rezultat);
    }
  } catch (error) {
    res.status(500).json({ greska: error.message });
  }
});

/*app.post("/prisustvo/predmet/:NAZIV/student/:index", async function (req, res) {

  let nazivPredmeta = req.params.NAZIV;
  let index = parseInt(req.params.index);
  let prisustvo = req.body;
  let provjera = false;
  try {
    const prisustva = await baza.prisustvo.findAll({
      where: {
        predmet: nazivPredmeta,
        index: index,
        sedmica: prisustvo.sedmica,
      },
    });
    if (prisustva.length > 0) {
      provjera = true;
      await baza.prisustva.update(
        {
          predavanja: prisustvo.predavanja,
          vjezbe: prisustvo.vjezbe,
        },
        {
          where: {
            predmet: nazivPredmeta,
            index: index,
            sedmica: prisustvo.sedmica,
          },
        }
      );
      res.status(200).json({
        tekst: "Prisustvo uspjesno azurirano ",
      });
    } else {
      await baza.prisustva.create({
        predmet: nazivPredmeta,
        index: index,
        sedmica: prisustvo.sedmica,
        predavanja: prisustvo.predavanja,
        vjezbe: prisustvo.vjezbe,
      });
      res.status(200).json({
        tekst: "Prisustvo kreirano",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error pri kreiranju prisustva",
      error: error,
    });
  }
});
*/
app.listen(3000);
module.exports = app;
