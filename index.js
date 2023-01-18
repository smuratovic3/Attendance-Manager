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
const predmeti = require("./models/predmeti");

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
      let predmeti = await baza.predmeti.findAll({
        where: {
          nastavnikId: req.session.user.id,
        },
      });
      predmeti = predmeti.map((p) => p.dataValues.predmet);
      console.log("semina", predmeti);
      res.status(200).json(predmeti);
    } catch (err) {
      console.log(err);
      res.status(500).json({ greska: "Greska prilikom dohvatanja predmeta" });
    }
  }
});

//get zahtjev za odgovarajucii predmet
app.get("/predmet/:naziv", function (req, res) {
  let naziv = req.params.naziv;
  let trazeniIndex = -1;
  for (let i = 0; i < prisustva.length; i++) {
    if (prisustva[i].predmet === naziv) {
      trazeniIndex = i;
    }
  }
  if (trazeniIndex === -1) {
    res.status(404).json({ greska: "Predmet ne postoji" });
  } else {
    res.status(200).json(prisustva[trazeniIndex]);
  }
});

app.post("/prisustvo/predmet/:NAZIV/student/:index", function (req, res) {
  let nazivPredmeta = req.params.NAZIV;
  let index = parseInt(req.params.index);
  let prisustvo = req.body;

  console.log(prisustvo);
  let indexPrisustva;
  let provjera = false;
  for (let i = 0; i < prisustva.length; i++) {
    if (prisustva[i].predmet === nazivPredmeta) {
      indexPrisustva = i;
      for (let j = 0; j < prisustva[i].prisustva.length; j++) {
        if (
          prisustva[i].prisustva[j].index === index &&
          prisustva[i].prisustva[j].sedmica === prisustvo.sedmica
        ) {
          prisustva[i].prisustva[j].predavanja = prisustvo.predavanja;
          prisustva[i].prisustva[j].vjezbe = prisustvo.vjezbe;

          provjera = true;
        }
      }
      if (!provjera) {
        prisustva[i].prisustva.push({
          sedmica: prisustvo.sedmica,
          predavanja: prisustvo.predavanja,
          vjezbe: prisustvo.vjezbe,
          index: index,
        });
      }
    }
  }
  fs.writeFile(
    "./data/prisustva.json",
    JSON.stringify(prisustva),
    function (error, data) {
      if (error) {
        console.log("greska");
      } else {
        res.status(200).json(prisustva[indexPrisustva]);
      }
    }
  );
});

app.listen(3000);
module.exports = app;
