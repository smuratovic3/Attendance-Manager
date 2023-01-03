const express = require("express"); // dodajemo expres
const bodyParser = require("body-parser"); //paket body parser za parsiranje stringa u jason
const app = express(); //pravimo insancu expresa
const path = require("path"); // citanje iz patha
const nastavnici = require("./data/nastavnici.json");
app.use(express.static(path.join(__dirname + "/public/html"))); //naglasavamo expresu koje staticke fajlove da korsitmo, sta sve mozemo korsitit
app.use(express.static(path.join(__dirname + "/public/css")));
app.use(express.static(path.join(__dirname + "/public/ikone")));
app.use(express.static(path.join(__dirname + "/public/scripts")));
app.use(bodyParser.json()); // naglasavamo serveru da moze koristiti jason format
app.use(bodyParser.urlencoded({ extended: true })); // da moze koristit afrikate

app.get("/vjezbe/", function (req, res) {
  console.log("Semina");
  res.status(200).json({ poruka: "dobro je" });
});

app.post("/login/", function (req, res) {
  console.log("Semina", req.body);
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

app.listen(3000);
module.exports = app;
