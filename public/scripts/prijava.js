function potvrdi() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  PoziviAjax.postLogin(username, password, function (error, data) {
    /*let jsonParsed = JSON.parse(data);
    console.log(jsonParsed.poruka);*/
    if (document.getElementById("prostor_za_poruku").lastChild)
      document
        .getElementById("prostor_za_poruku")
        .removeChild(document.getElementById("prostor_za_poruku").lastChild);
    if (error != null) {
      document
        .getElementById("prostor_za_poruku")
        .appendChild(document.createTextNode(data));
    } else {
      sessionStorage.setItem("korisnik", username);
      //window.open("http://localhost:3000/predmeti.html");
      window.location.href = "http://localhost:3000/predmeti.html";
    }
  });
}
