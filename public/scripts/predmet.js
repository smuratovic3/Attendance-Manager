window.onload = function () {
  let username = sessionStorage.getItem("korisnik");
  ///dalja logika za odgovarajuce predmete
};

function logout() {
  sessionStorage.removeItem("korisnik");
  window.open("http://localhost:3000/prijava.html");
}
