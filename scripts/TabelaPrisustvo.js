let TabelaPrisustvo = function (divRef, podaci) {
  const MAKSIMALNI_BROJ_SEDMICA = 15;

  // Provjeri da li je div prazan
  if (divRef.hasChildNodes()) {
    divRef.innerHTML = "";
  }

  function arapskiURimski(broj) {
    switch (broj) {
      case 1:
        return "I";
      case 2:
        return "II";
      case 3:
        return "III";
      case 4:
        return "IV";
      case 5:
        return "V";
      case 6:
        return "VI";
      case 7:
        return "VII";
      case 8:
        return "VIII";
      case 9:
        return "IX";
      case 10:
        return "X";
      case 11:
        return "XI";
      case 12:
        return "XII";
      case 13:
        return "XIII";
      case 14:
        return "XIV";
      case 15:
        return "XV";
      default:
        return "-";
    }
  }

  // Lista sedmica
  // Koristi se i u ostatku koda!
  let sedmice = [];
  for (let j = 0; j < podaci.prisustva.length; j++) {
    const unos = podaci.prisustva[j];
    if (!sedmice.includes(unos.sedmica)) {
      sedmice.push(unos.sedmica);
    }
  }
  sedmice.sort();

  //naziv predmeta i broj predavanja i vjezbi sedmicno
  var predmet = document.createElement("h1");
  predmet.textContent = podaci.predmet;
  divSadrzaj.appendChild(predmet);

  var brPredSedm = document.createElement("h2");
  brPredSedm.textContent =
    "Broj predavanja sedmično: " + podaci.brojPredavanjaSedmicno;
  divSadrzaj.appendChild(brPredSedm);

  var brVjSedm = document.createElement("h3");
  brVjSedm.textContent = "Broj vježbi sedmično: " + podaci.brojVjezbiSedmicno;
  divSadrzaj.appendChild(brVjSedm);

  let table = document.createElement("table");

  // ===================
  // HEADER
  // ===================

  let headerTr = document.createElement("tr");

  //   IME
  let nameHeader = document.createElement("th");
  nameHeader.innerHTML = "Ime i prezime";
  nameHeader.classList.add("prva_kol");
  headerTr.appendChild(nameHeader);

  // INDEX
  let indexHeader = document.createElement("th");
  indexHeader.innerHTML = "Index";
  headerTr.appendChild(indexHeader);

  // PRVA DO PREDZADNJA SEDMICE
  for (let i = 0; i < sedmice.length - 1; i++) {
    const sedmica = sedmice[i];
    let header = document.createElement("th");
    header.innerHTML = arapskiURimski(sedmica);
    headerTr.appendChild(header);
  }

  // ZADNJA DETALJNA SEDMICA
  let lastHeader = document.createElement("th");
  lastHeader.innerHTML = arapskiURimski(sedmice.length);
  lastHeader.colSpan =
    podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno;
  headerTr.appendChild(lastHeader);

  // PREOSTALI BROJ PRAZNIH SEDMICA (UKOLIKO IH IMA)
  if (MAKSIMALNI_BROJ_SEDMICA - sedmice.length > 0) {
    let header = document.createElement("th");
    header.innerHTML =
      arapskiURimski(sedmice.length + 1) +
      " - " +
      arapskiURimski(MAKSIMALNI_BROJ_SEDMICA);
    headerTr.appendChild(header);
  }

  // DODAJ HEADER NA TABELU
  table.appendChild(headerTr);
  divRef.appendChild(table);
};
