window.onload = function () {
  PoziviAjax.getPredmeti(function (error, data) {
    if (error != null) {
      let kontejner = document.getElementById("predmeti");
      kontejner.appendChild(document.createTextNode(data));
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

function otvoriPredmet(kartica) {
  console.log("Naziv:", kartica.innerText);
  PoziviAjax.getPredmet(kartica.innerText, function (error, data) {
    if (error != null) {
      console.log("greska");
    } else {
      let podaci = JSON.parse(data);
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
  console.log("Pritisnuto je:", clickedElement);
});
