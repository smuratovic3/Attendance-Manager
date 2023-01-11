const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const nastavnici = require("./data/nastavnici.json");
const prisustva = require("./data/prisustva.json");
const session = require("express-session");
const bcrypt = require("bcrypt");

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

//post zahtjev gdje se vrsi provjera da li korisnik postoji i da li je ispravna sifra
app.post("/login/", function (req, res) {
  for (let i = 0; i < nastavnici.length; i++) {
    if (nastavnici[i].nastavnik.username === req.body.username) {
      bcrypt.compare(
        req.body.password,
        nastavnici[i].nastavnik.password_hash,
        (err, result) => {
          if (result) {
            req.session.user = req.body;
            res.status(200).json({ poruka: "Uspješna prijava" });
          } else {
            res.status(404).json({ poruka: "Neuspješna prijava" });
          }
        }
      );
    }
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
app.get("/predmeti/", function (req, res) {
  if (!req.session.user) {
    res.status(404).json({ greska: "Nastavnik nije loginovan" });
  }
  let korisnickoIme = req.session.user.username;
  let predmeti;
  for (let i = 0; i < nastavnici.length; i++) {
    if (nastavnici[i].nastavnik.username === korisnickoIme) {
      predmeti = nastavnici[i].predmeti;
      break;
    }
  }
  res.status(200).json(predmeti);
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

app.post("/prisustvo/predmet/:NAZIV/student/:index", function (req, res) {});

app.listen(3000);
module.exports = app;
