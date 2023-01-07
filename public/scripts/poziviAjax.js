const PoziviAjax = (() => {
  function impl_getPredmet(naziv, fnCallback) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
      if (ajax.readyState == 4 && ajax.status == 200) {
        fnCallback(null, ajax.responseText);
      } else if (ajax.readyState == 4 && ajax.status == 404) {
        fnCallback(ajax.statusText, ajax.responseText);
      }
    };
    ajax.open("GET", "http://localhost:3000/predmet/" + naziv, true);
    ajax.send();
  }

  // vraća listu predmeta za loginovanog nastavnika ili grešku da nastavnik nije loginovan
  function impl_getPredmeti(fnCallback) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
      if (ajax.readyState == 4 && ajax.status == 200) {
        fnCallback(null, ajax.responseText);
      } else if (ajax.readyState == 4 && ajax.status == 404) {
        fnCallback(ajax.statusText, ajax.responseText);
      }
    };
    ajax.open("GET", "http://localhost:3000/predmeti", true);
    ajax.send();
  }

  function impl_postLogin(username, password, fnCallback) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
      if (ajax.readyState == 4 && ajax.status == 200) {
        fnCallback(null, ajax.responseText);
      } else if (ajax.readyState == 4 && ajax.status == 404) {
        fnCallback(ajax.statusText, ajax.responseText);
      }
    };
    ajax.open("POST", "http://localhost:3000/login", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send(JSON.stringify({ username: username, password: password }));
  }
  function impl_postLogout(fnCallback) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
      if (ajax.readyState == 4 && ajax.status == 200) {
        fnCallback(null, "sve super");
      } else if (ajax.readyState == 4 && ajax.status == 404) {
        fnCallback("greska", "");
      }
    };
    console.log("radi 2");
    ajax.open("POST", "http://localhost:3000/logout", true);
    //ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send();
  }
  //prisustvo ima oblik {sedmica:N,predavanja:P,vjezbe:V}
  function impl_postPrisustvo(naziv, index, prisustvo, fnCallback) {}
  return {
    postLogin: impl_postLogin,
    postLogout: impl_postLogout,
    getPredmet: impl_getPredmet,
    getPredmeti: impl_getPredmeti,
    postPrisustvo: impl_postPrisustvo,
  };
})();
