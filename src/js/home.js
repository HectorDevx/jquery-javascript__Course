//----------------------------------------Variables
// console.log("hola mundo!");
// const noCambia = "Leonidas";

// let cambia = "@LeonidasEsteban";

// function cambiarNombre(nuevoNombre) {
//   cambia = nuevoNombre;
// }

//----------------------------------------Promesas
// const getUserAll = new Promise(function (todoBien, todoMal) {
//   // Llamar a un Api
//   setTimeout(function () {
//     //Luego de 3s
//     todoBien("Se acabó el tiempo");
//   }, 5000);
// });

// const getUser = new Promise(function (todoBien, todoMal) {
//   // Llamar a un Api
//   setTimeout(function () {
//     //Luego de 3s
//     todoBien("Todo bien");
//   }, 3000);
// });

// getUser
//   .then(function () {
//     console.log("todo está bien en la vida");
//   })
//   .catch(function (message) {
//     console.log(message);
//   });

// Promise.race([getUserAll, getUser])
//   .then(function (message) {
//     console.log(message);
//   })
//   .catch(function (message) {
//     console.log(message);
//   });

// --------------------------------------------jQuery XMLHttpRequest
// $.ajax("https://randomuser.me/api/", {
//   method: "GET",
//   sucess: function (data) {
//     console.log(data);
//   },
//   error: function (error) {
//     console.log(error);
//   },
// });

//------------------------------------------------Javascript Fetch
// fetch("https://randomuser.me/api/")
//   .then(function (response) {
//     console.log(response);
//     return response.json();
//   })
//   .then(function (user) {
//     console.log("user", user.results[0].name.first);
//   })
//   .catch(function () {
//     console.log("Hubo un fallo");
//   });

//----------------------------------------Funciones Asincronas
//Solicitamos la información de nuestra API y la almacenamos en variables.
(async function load() {
  async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    if (data.data.movie_count > 0) {
      return data;
    } else {
      throw new Error("No se encontró ningún resultado");
    }
  }

  //Leasignamos el evento a escuchar al formulario de buscador.
  const $form = document.getElementById("form");
  const $home = document.getElementById("home");
  const $featuringContainer = document.getElementById("featuring");

  function setAttributes($element, attributes) {
    for (const attribute in attributes) {
      $element.setAttribute(attribute, attributes[attribute]);
    }
  }

  const BASE_API = "https://yts.mx/api/v2/";

  //Template HTML que se despliega al mostrar el resultado de una búsqueda
  function featuringTemplate(peli) {
    return `<div class="featuring">
          <div class="featuring-image">
            <img
              src="${peli.medium_cover_image}"
              width="70"
              height="100"
              alt=""
            />
          </div>
          <div class="featuring-content">
            <p class="featuring-title">Pelicula encontrada</p>
            <p class="featuring-album">${peli.title}</p>
          </div>
        </div>`;
  }

  $form.addEventListener("submit", async (event) => {
    event.preventDefault();
    $home.classList.add("search-active");
    const $loader = document.createElement("img");
    setAttributes($loader, {
      src: "src/images/loader.gif",
      height: 50,
      width: 50,
    });

    //Me devuelven la información de la película que se está buscando.
    $featuringContainer.append($loader);
    const data = new FormData($form);
    try {
      const {
        data: { movies: pelis },
      } = await getData(
        `${BASE_API}list_movies.json?limit=1&query_term=${data.get("name")}`
      );
      const HTMLString = featuringTemplate(pelis[0]);
      $featuringContainer.innerHTML = HTMLString;
    } catch (error) {
      alert(error.message);
      $loader.remove();
      $home.classList.remove("search-active");
    }
  });

  //Función que nos devuelve el HTML.
  function videoItemTemplate(movie, category) {
    return `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
    <div class="primaryPlaylistItem-image">
    <img src="${movie.medium_cover_image}">
    </div>
    <h4 class="primaryPlaylistItem-title">
    ${movie.title}
    </h4>
    </div>`;
  }

  //Imprimimos el template en el Archivo HTML ya con la información de nuestra lista
  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }

  function addEventClick($element) {
    $element.addEventListener("click", () => {
      showModal($element);
    });
  }

  //Generamos las películas de la lista.
  function renderMovieList(list, $container, category) {
    $container.children[0].remove();
    list.forEach((movie) => {
      const HTMLString = videoItemTemplate(movie, category); //En esta constante almacenamos el template
      const movieElement = createTemplate(HTMLString);
      $container.append(movieElement);
      const image = movieElement.querySelector("img");
      image.addEventListener("load", (event) => {
        event.srcElement.classList.add("fadeIn");
      });
      addEventClick(movieElement);
    });
  }

  //Le enviamos los parametros de cada lista y contenedor HTML a la función que nos genera el template para cada película.
  //Hacemos la petición de información justo antes de utilizarla para que vaya cargando en orden
  const {
    data: { movies: actionList },
  } = await getData(`${BASE_API}list_movies.json?genre=action`);
  const $actionContainer = document.querySelector("#action");
  renderMovieList(actionList, $actionContainer, "action");

  const {
    data: { movies: dramaList },
  } = await getData(`${BASE_API}list_movies.json?genre=drama`);
  const $dramaContainer = document.getElementById("drama");
  renderMovieList(dramaList, $dramaContainer, "drama");

  const {
    data: { movies: animationList },
  } = await getData(`${BASE_API}list_movies.json?genre=animation`);
  const $animationContainer = document.getElementById("animation");
  renderMovieList(animationList, $animationContainer, "animation");

  // Otros Contenedores
  const $modal = document.getElementById("modal");
  const $overlay = document.getElementById("overlay");
  const $hideModal = document.getElementById("hide-modal");

  const $modalTitle = $modal.querySelector("h1");
  const $modalImage = $modal.querySelector("img");
  const $modalDescription = $modal.querySelector("p");

  function findById(list, id) {
    return list.find((movie) => movie.id === parseInt(id, 10));
  }

  // Función para encontrar películas
  function findMovie(id, category) {
    switch (category) {
      case "action": {
        return findById(actionList, id);
      }
      case "drama": {
        return findById(dramaList, id);
      }
      default: {
        return findById(animationList, id);
      }
    }
  }

  //Funciones que muestran y ocultan el modal del Elemento Movie
  function showModal($element) {
    $overlay.classList.add("active");
    $modal.style.animation = "modalIn .8s forwards";
    const id = $element.dataset.id;
    const category = $element.dataset.category;
    const data = findMovie(id, category);
    $modalTitle.textContent = data.title;
    $modalImage.setAttribute("src", data.medium_cover_image);
    $modalDescription.textContent = data.description_full;
  }

  $hideModal.addEventListener("click", hideModal);
  function hideModal() {
    $overlay.classList.remove("active");
    $modal.style.animation = "modalOut .8s forwards";
  }
})();
