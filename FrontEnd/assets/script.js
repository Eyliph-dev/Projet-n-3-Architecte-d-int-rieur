import "./gallery.js";
import "./modale.js";

// ----------- Mode édition --------------

// Récupération du token
const token = sessionStorage.getItem("token");

const log = document.querySelector(".login");

// Suppression du token lors du click sur "logout"
log.addEventListener("click", () => {
  sessionStorage.removeItem("token");
});

editPage(token);

// Fonction permettant de changer la page en mode édition
function editPage(token) {
  const edit = document.body;

  if (token !== null) {
    edit.classList.add("edit");
    log.textContent = "logout";
    log.setAttribute("href", "index.html");
  } else {
    log.textContent = "login";
  }
}
