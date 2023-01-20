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
const prisustvo = require("./models/prisustvo");

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

      let studenti = await baza.student.findAll({
        where: {
          predmetId: predmet.id,
        },
      });

      //određene informacije iz niza, uzimam i pravim novi niz
      prisustva = prisustva.map((p) => p.dataValues);
      studenti = studenti.map((p) => p.dataValues);
      for (let i = 0; i < studenti.length; i++) {
        studenti[i].index = studenti[i].indeks;
      }
      for (let i = 0; i < prisustva.length; i++) {
        prisustva[i].index = prisustva[i].indeks;
      }

      const rezultat = {
        studenti,
        prisustva,
        brojPredavanjaSedmicno,
        brojVjezbiSedmicno,
        predmet: predmet.predmet,
      };
      //console.log(rezultat);
      res.status(200).json(rezultat);
    }
  } catch (error) {
    res.status(500).json({ greska: error.message });
  }
});

app.post("/prisustvo/predmet/:NAZIV/student/:index", async (req, res) => {
  try {
    const naziv = req.params.NAZIV;
    const indeks = parseInt(req.params.index);
    const sedmica = req.body.sedmica;
    const predavanja = req.body.predavanja;
    const vjezbe = req.body.vjezbe;

    // Nadji predmet po nazivu
    let predmet = await baza.predmet.findOne({ where: { predmet: naziv } });
    predmet = predmet.dataValues;

    // Nadji sva prisustva za predmet
    let prisustva = await baza.prisustvo.findAll({
      where: { predmetId: predmet.id },
    });

    // Nadji sve studente za predmet
    let studenti = await baza.student.findAll({
      where: { predmetId: predmet.id },
    });

    let prisustvoExists = false;
    const targetPrisustvo = prisustva.find(
      (obj) => obj.sedmica == sedmica && obj.indeks == indeks
    );

    if (targetPrisustvo) {
      prisustvoExists = true;
      targetPrisustvo.predavanja = predavanja;
      targetPrisustvo.vjezbe = vjezbe;
      await targetPrisustvo.save();
    }
    // Kreirati novo prisustvo ako ne postoji
    if (!prisustvoExists) {
      await baza.prisustvo.create({
        sedmica: sedmica,
        predavanja: predavanja,
        vjezbe: vjezbe,
        indeks: indeks,
        predmetId: predmet.id,
      });
    }

    const povratniStudenti = studenti.map((student) => ({
      ime: student.ime,
      index: student.indeks,
    }));

    let povratnaPrisustva = prisustva.map((item) => ({
      sedmica: item.sedmica,
      predavanja: item.predavanja,
      vjezbe: item.vjezbe,
      index: item.indeks,
    }));

    let jsonPodaci = {
      studenti: povratniStudenti,
      prisustva: povratnaPrisustva,
      predmet: predmet.predmet,
      brojPredavanjaSedmicno: predmet.brojPredavanjaSedmicno,
      brojVjezbiSedmicno: predmet.brojVjezbiSedmicno,
    };
    // Poslati odgovor sa updateanim podacima
    res.status(200).json(jsonPodaci);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

app.listen(3000);
module.exports = app;
