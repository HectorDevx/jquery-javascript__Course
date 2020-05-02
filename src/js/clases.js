----------------------------------------Variables
console.log("hola mundo!");
const noCambia = "Leonidas";

let cambia = "@LeonidasEsteban";

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre;
}

----------------------------------------Promesas
const getUserAll = new Promise(function (todoBien, todoMal) {
  // Llamar a un Api
  setTimeout(function () {
    //Luego de 3s
    todoBien("Se acabó el tiempo");
  }, 5000);
});

const getUser = new Promise(function (todoBien, todoMal) {
  // Llamar a un Api
  setTimeout(function () {
    //Luego de 3s
    todoBien("Todo bien");
  }, 3000);
});

getUser
  .then(function () {
    console.log("todo está bien en la vida");
  })
  .catch(function (message) {
    console.log(message);
  });

Promise.race([getUserAll, getUser])
  .then(function (message) {
    console.log(message);
  })
  .catch(function (message) {
    console.log(message);
  });

--------------------------------------------jQuery XMLHttpRequest
$.ajax("https://randomuser.me/api/", {
  method: "GET",
  sucess: function (data) {
    console.log(data);
  },
  error: function (error) {
    console.log(error);
  },
});

------------------------------------------------Javascript Fetch
fetch("https://randomuser.me/api/")
  .then(function (response) {
    console.log(response);
    return response.json();
  })
  .then(function (user) {
    console.log("user", user.results[0].name.first);
  })
  .catch(function () {
    console.log("Hubo un fallo");
  });
