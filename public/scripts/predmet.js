window.onload = function () {
  PoziviAjax.getPredmeti(function (error, data) {
    if (error != null) {
      data = JSON.parse(data);
      let kontejner = document.getElementById("predmeti");
      kontejner.appendChild(document.createTextNode(data.greska));
    } else {
      data = JSON.parse(data);

      let kontejner = document.getElementById("predmeti");
      for (let i = 0; i < data.length; i++) {
        let predmet = document.createElement("div");
        predmet.appendChild(document.createTextNode(data[i]));
        predmet.setAttribute("onClick", "otvoriPredmet(this)");

        kontejner.appendChild(predmet);
      }
    }
  });
  ///dalja logika za odgovarajuce predmete
};

let podaci;
function otvoriPredmet(kartica) {
  console.log("Naziv:", kartica.innerText);
  PoziviAjax.getPredmet(kartica.innerText, function (error, data) {
    if (error != null) {
      console.log("greska");
    } else {
      podaci = JSON.parse(data);
      let kontejner = document.getElementById("kontejner");
      let prisustvo = TabelaPrisustvo(kontejner, podaci);
    }
  });
}

function logout() {
  PoziviAjax.postLogout(function (error, data) {
    if (error != null) {
      console.log("greska");
    } else {
      //window.open("http://localhost:3000/prijava.html");
      window.location.href = "http://localhost:3000/prijava.html";
    }
  });
}

//fja za mouseover
function myFunction() {
  document.querySelector("#predmeti").style.cursor = "pointer";
}

//listener za tabelu, šta je kliknuto
let prisustvoTabela = document.getElementById("kontejner");
prisustvoTabela.addEventListener;
// Add the event listener
prisustvoTabela.addEventListener("click", function (event) {
  // event.target refers to the element that was clicked
  var clickedElement = event.target;
  if (
    clickedElement.className === "odsutan" ||
    clickedElement.className === "prisutan" ||
    clickedElement.className === "bijelo"
  ) {
    let nizPodataka = clickedElement.id.split("-");
    let brojIndexa = parseInt(nizPodataka[4]);
    let brojPredavanja = parseInt(nizPodataka[2]);
    let brojVjezbi = parseInt(nizPodataka[3]);
    let nazivPredmeta = nizPodataka[0];
    let brojSedmice = parseInt(nizPodataka[1]);

    if (nizPodataka[5] === "P") {
      if (clickedElement.className === "prisutan") {
        if (brojPredavanja > 0) {
          brojPredavanja--;
        }
      } else if (
        clickedElement.className === "odsutan" ||
        brojPredavanja === NaN
      ) {
        if (!brojPredavanja) {
          brojPredavanja = 1;
        } else if (brojPredavanja < podaci.brojPredavanjaSedmicno) {
          brojPredavanja++;
        }
      } else {
        brojPredavanja = 1;
      }
    } else {
      if (clickedElement.className === "prisutan") {
        if (brojVjezbi > 0) {
          brojVjezbi--;
        }
      } else if (clickedElement.className === "odsutan" || brojVjezbi === NaN) {
        if (!brojVjezbi) {
          brojVjezbi = 1;
        } else if (brojVjezbi < podaci.brojVjezbiSedmicno) {
          brojVjezbi++;
        }
      } else {
        brojVjezbi = 1;
      }
    }
    let prisustvoObjekat = {
      sedmica: brojSedmice,
      predavanja: brojPredavanja,
      vjezbe: brojVjezbi,
    };
    console.log("prisustvo", prisustvoObjekat);
    window.sedmicaUFokusu = brojSedmice;
    PoziviAjax.postPrisustvo(
      nazivPredmeta,
      brojIndexa,
      prisustvoObjekat,
      function (error, data) {
        if (error) {
        } else {
          podaci = JSON.parse(data);
          console.log("podaci", podaci);
          let kontejner = document.getElementById("kontejner");
          let prisustvo = TabelaPrisustvo(kontejner, podaci, brojSedmice);
          //da se ne vraća na zadnju sedmicu kada unosim prisustvo za ostale
          let i = sedmicaUFokusu;
          while (i > brojSedmice) {
            prisustvo.prethodnaSedmica();
            i--;
          }
        }
      }
    );
  }
});
