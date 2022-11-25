let TabelaPrisustvo = function (divRef, podaci) {
  const MAKSIMALNI_BROJ_SEDMICA = 15;

  // Provjeri da li je div prazan
  if (divRef.hasChildNodes()) {
    divRef.innerHTML = "";
  }

  function provjeriDuplikat(array) {
    return new Set(array).size !== array.length;
  }

  function ispisiGresku() {
    let div = document.createElement("div");
    div.innerHTML = "Podaci o prisustvu nisu validni!";
    divRef.appendChild(div);
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

  // 1. Broj prisustva na predavanju/vježbi je veći od broja predavanja/vježbi sedmično
  // 2. Broj prisustva je manji od nule

  function validacijaJedanIDva() {
    let status = true;
    for (let i = 0; i < podaci.prisustva.length; i++) {
      const unos = podaci.prisustva[i];
      if (
        unos.predavanja > podaci.brojPredavanjaSedmicno ||
        unos.vjezbe > podaci.brojVjezbiSedmicno ||
        unos.predavanja < 0 ||
        unos.vjezbe < 0
      ) {
        status = false;
        break;
      }
    }
    return status;
  }

  // 3. Isti student ima dva ili više unosa prisustva za istu sedmicu
  function validacijaTri() {
    let status = false;
    for (let i = 0; i < podaci.studenti.length; i++) {
      const student = podaci.studenti[i];
      let sedmice = [];
      for (let j = 0; j < podaci.prisustva.length; j++) {
        const prisustvo = podaci.prisustva[j];
        if (prisustvo.index === student.index) {
          sedmice.push(prisustvo.sedmica);
        }
      }
      if (provjeriDuplikat(sedmice)) {
        status = true;
        break;
      }
    }
    return status;
  }

  // 4. Postoje dva ili više studenata sa istim indeksom u listi studenata
  function validacijaCetiri() {
    let status = false;
    let indexi = [];
    for (let i = 0; i < podaci.studenti.length; i++) {
      const student = podaci.studenti[i];
      indexi.push(student.index);
    }
    if (provjeriDuplikat(indexi)) {
      status = true;
    }
    return status;
  }

  // 5. Postoji prisustvo za studenta koji nije u listi studenata
  function validacijaPet() {
    let status = false;
    let indexi = [];
    for (let i = 0; i < podaci.studenti.length; i++) {
      const student = podaci.studenti[i];
      indexi.push(student.index);
    }
    for (let j = 0; j < podaci.prisustva.length; j++) {
      const unos = podaci.prisustva[j];
      if (!indexi.includes(unos.index)) {
        status = true;
        break;
      }
    }
    return status;
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

  // VALIDACIJE 1-5
  if (
    !validacijaJedanIDva() ||
    validacijaTri() ||
    validacijaCetiri() ||
    validacijaPet()
  ) {
    ispisiGresku();
    return;
  }

  //Naziv predmeta i broj predavanja i vjezbi sedmicno
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

  // Header
  let headerTr = document.createElement("tr");

  //   Ime
  let nameHeader = document.createElement("th");
  nameHeader.innerHTML = "Ime i prezime";
  nameHeader.classList.add("prva_kol");
  headerTr.appendChild(nameHeader);

  // Index
  let indexHeader = document.createElement("th");
  indexHeader.innerHTML = "Index";
  headerTr.appendChild(indexHeader);

  // Prva do predzadnje sedmice
  for (let i = 0; i < sedmice.length - 1; i++) {
    const sedmica = sedmice[i];
    let header = document.createElement("th");
    header.innerHTML = arapskiURimski(sedmica);
    headerTr.appendChild(header);
  }

  // Zadnja detaljna sedmica
  let lastHeader = document.createElement("th");
  lastHeader.innerHTML = arapskiURimski(sedmice.length);
  lastHeader.colSpan =
    podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno;
  headerTr.appendChild(lastHeader);

  // Preostali broj sedmica (Ukoliko ih ima)
  if (MAKSIMALNI_BROJ_SEDMICA - sedmice.length > 0) {
    let header = document.createElement("th");
    header.innerHTML =
      arapskiURimski(sedmice.length + 1) +
      " - " +
      arapskiURimski(MAKSIMALNI_BROJ_SEDMICA);
    headerTr.appendChild(header);
  }

  // dodavanje headera na tabelu
  table.appendChild(headerTr);

  // Sadrzaj
  for (let i = 0; i < podaci.studenti.length; i++) {
    const student = podaci.studenti[i];

    // Prvi red
    let firstRowContentTr = document.createElement("tr");

    // Ime
    let name = document.createElement("td");
    name.rowSpan = "2";
    name.style.verticalAlign = "top";
    name.innerHTML = student.ime;
    firstRowContentTr.appendChild(name);

    // Index
    let index = document.createElement("td");
    index.rowSpan = "2";
    index.style.verticalAlign = "top";
    index.innerHTML = student.index;
    firstRowContentTr.appendChild(index);

    // Prva do predzadnja sedmica
    for (let j = 0; j < sedmice.length - 1; j++) {
      const prisustvo = podaci.prisustva.find(function (p) {
        return p.index === student.index && p.sedmica === j + 1;
      });
      let td = document.createElement("td");
      td.rowSpan = "2";
      td.style.verticalAlign = "top";
      if (prisustvo) {
        td.innerHTML =
          ((prisustvo.predavanja + prisustvo.vjezbe) /
            (podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno)) *
            100 +
          "%";
      }
      firstRowContentTr.appendChild(td);
    }

    // Detaljna zadnja sedmica --> Predavanja
    for (let j = 0; j < podaci.brojPredavanjaSedmicno; j++) {
      let td = document.createElement("td");
      td.classList.add("sedma");
      td.innerHTML = "P";
      firstRowContentTr.appendChild(td);
    }

    // Detaljna zadnja sedmica --> Vjezbe
    for (let j = 0; j < podaci.brojVjezbiSedmicno; j++) {
      let td = document.createElement("td");
      td.classList.add("sedma");
      td.innerHTML = "V";
      firstRowContentTr.appendChild(td);
    }

    // Preostali broj sedmica (Ukoliko ih ima)
    // Prazno polje
    if (MAKSIMALNI_BROJ_SEDMICA - sedmice.length > 0) {
      let prazno = document.createElement("td");
      prazno.rowSpan = "2";
      prazno.style.verticalAlign = "top";
      firstRowContentTr.appendChild(prazno);
    }

    // Dodavanje sadrzaja na tabelu
    table.appendChild(firstRowContentTr);

    // Drugi red
    let secondRowContentTr = document.createElement("tr");

    // Prisustvo --> Predavanja
    for (let j = 0; j < podaci.brojPredavanjaSedmicno; j++) {
      const unos = podaci.prisustva.find(function (p) {
        return (
          p.index === student.index && p.sedmica === sedmice[sedmice.length - 1]
        );
      });

      let klasa = "prisutan";
      if (j + 1 > unos.predavanja) {
        klasa = "odsutan";
      }

      let td = document.createElement("td");
      td.classList.add(klasa);
      secondRowContentTr.appendChild(td);
    }

    // Prisustvo --> Vjezbe
    for (let j = 0; j < podaci.brojVjezbiSedmicno; j++) {
      const unos = podaci.prisustva.find(function (p) {
        return (
          p.index === student.index && p.sedmica === sedmice[sedmice.length - 1]
        );
      });

      let klasa = "prisutan";
      if (j + 1 > unos.vjezbe) {
        klasa = "odsutan";
      }

      let td = document.createElement("td");
      td.classList.add(klasa);
      secondRowContentTr.appendChild(td);
    }

    // Dodavanje sadrzaja na tabelu
    table.appendChild(secondRowContentTr);
  }

  // Dodaanje tabele na referentni
  divRef.appendChild(table);
};
