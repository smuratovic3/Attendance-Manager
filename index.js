const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const nastavnici = require("./data/nastavnici.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/public/html")));
app.use(express.static(path.join(__dirname + "/public/css")));
app.use(express.static(path.join(__dirname + "/public/ikone")));
app.use(express.static(path.join(__dirname + "/public/scripts")));

//post zahtjev gdje se vrsi provjera da li korisnik postoji i da li je ispravna sifra
app.post("/login/", function (req, res) {
  let provjera = false;
  for (let i = 0; i < nastavnici.length; i++) {
    if (nastavnici[i].nastavnik.username === req.body.username) {
      if (nastavnici[i].nastavnik.password_hash === req.body.password) {
        provjera = true;
      }
    }
  }
  if (provjera) {
    res.status(200).json({ poruka: "Uspješna prijava" });
  } else {
    res.status(404).json({ poruka: "Neuspješna prijava" });
  }
});

// get zahtjev za loginovanog nastavnika, ako nije loginovan poruka Nastavnik nije loginovan
app.get("/predmeti/", function (req, res) {
  let provjera = false;
  for (let i = 0; i < nastavnici.length; i++) {
    if (nastavnici[i].nastavnik.username === req.body.username) {
      if (nastavnici[i].nastavnik.password_hash === req.body.password) {
        provjera = true;
      }
    }
  }
  if (!provjera) {
    res.status(404).json({ greska: "Nastavnik nije loginovan" });
  }
});

app.listen(3000);
module.exports = app;
