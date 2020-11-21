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

  //Le asignamos el evento a escuchar al formulario de buscador.
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

  //Función si hay cache utiliza esos datos, si no lo hay solicitalos
  async function cacheExist(category) {
    const listName = `${category}List`;
    const cacheList = window.localStorage.getItem(listName);
    if (cacheList) {
      return JSON.parse(cacheList);
    }
    const {
      data: { movies: data },
    } = await getData(`${BASE_API}list_movies.json?genre=${category}`);
    localStorage.setItem("listName", JSON.stringify(data));
    return data;
  }

  //Le enviamos los parametros de cada lista y contenedor HTML a la función que nos genera el template para cada película.
  //Hacemos la petición de información justo antes de utilizarla para que vaya cargando en orden
  // const {
  //   data: { movies: actionList },
  // } = await getData(`${BASE_API}list_movies.json?genre=action`);
  const actionList = await cacheExist("action");
  // localStorage.setItem("actionList", JSON.stringify(actionList));
  const $actionContainer = document.querySelector("#action");
  renderMovieList(actionList, $actionContainer, "action");

  const dramaList = await cacheExist("drama");
  // localStorage.setItem("dramaList", JSON.stringify(dramaList));
  const $dramaContainer = document.getElementById("drama");
  renderMovieList(dramaList, $dramaContainer, "drama");

  const animationList = await cacheExist("animation");
  // localStorage.setItem("dramaList", JSON.stringify(dramaList));
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

  //1. Crear la función que nos trae nuestros datos desde una API
  async function getUsers(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  //2. Variable con nuestra API
  const USERS_API = "https://randomuser.me/api/";

  //3. Asignamos el selector de nuestra clase padre
  $friends = document.querySelector(".playlistFriends");

  //4. Función de pintado del template HTML para cada usuario
  function templateUsers(user) {
    return `
      <li class="playlistFriends-item">
        <a href="#">
        <img
          src="${user.picture.thumbnail}"
          alt="echame la culpa"
        />
        <span>
          ${user.name.first} ${user.name.last}
        </span>
        </a>
  </li>`;
  }

  //5. Transforma nuestro string en un elemento HTML
  function userHTML(userString) {
    const HTML = document.implementation.createHTMLDocument();
    HTML.body.innerHTML = userString;
    return HTML.body.children[0];
  }

  //6. Hacemos el ciclo for para cada usuario que recibimos, transformamos a String, luego a HTML y enviamos al selector.
  function renderUsers(userList, $selector) {
    userList.forEach((user) => {
      const userToString = templateUsers(user);
      const userToHTML = userHTML(userToString);
      $selector.append(userToHTML);
    });
  }

  //7. Metemos los resultados a una variable y ejecutamos la función principal.
  const { results } = await getUsers(`${USERS_API}?results=10`);
  renderUsers(results, $friends);
})();
