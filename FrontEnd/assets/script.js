import { works, categories } from "./data.js";
import { displayProjets } from "./gallery.js";

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

// -------------- Modale ------------------

// Récupération des éléments de la modale dans le html
const modale = document.getElementById("modale");
const element1 = document.querySelector("#modale1");
const element2 = document.querySelector("#modale2");

// Affichage modale
document.querySelector(".modifier").addEventListener("click", () => {
  element1.classList.remove("hidden");
  element2.classList.add("hidden");
  modale.showModal();
});

// Fermeture modale si click sur croix
document.querySelectorAll(".closeModale").forEach((button) => {
  button.addEventListener("click", () => {
    modale.close();
  });
});

// Fermeture modale si clic en dehors
modale.addEventListener("click", (event) => {
  if (event.target === modale) {
    modale.close();
  }
});

// Passage de modale 1 à 2
const addPhoto = document.querySelector("#ajout-photo");
addPhoto.addEventListener("click", () => {
  element1.classList.add("hidden");
  element2.classList.remove("hidden");
});

// Passage de modale 2 à 1
const modaleReturn = document.querySelector("#retour-arriere");
modaleReturn.addEventListener("click", () => {
  element1.classList.remove("hidden");
  element2.classList.add("hidden");
});

// Event lors de la fermeture de la modale
modale.addEventListener("close", () => {
  resetFormPhoto();
});

// ------------- Modale 1: Vue Gallerie ----------------

// Affichage des projets dans la modale
function displayGalleryModale(works) {
  const galleryModale = document.querySelector(".modale-gallery");
  // Vidage de la galerie modale avant d'ajouter les projets
  galleryModale.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    // Création des éléments pour chaque projet
    const figure = document.createElement("figure");

    const imgElement = document.createElement("img");
    imgElement.src = works[i].imageUrl;
    imgElement.alt = works[i].title;

    // Création du bouton de suppression pour chaque projet
    const supElement = document.createElement("button");
    supElement.setAttribute(
      "aria-label",
      `Supprimer le projet ${works[i].title}`,
    );
    const imgSupElement = document.createElement("i");
    imgSupElement.classList.add("fa-solid", "fa-trash-can");
    supElement.appendChild(imgSupElement);
    // Appel de la fonction de suppression lors du clic
    supElement.addEventListener("click", () => {
      supProjet(works[i].id, works[i].title);
    });

    // Ajout des éléments dans le html
    galleryModale.appendChild(figure);
    figure.appendChild(imgElement);
    figure.appendChild(supElement);
  }
}

displayGalleryModale(works);

// Fonction permettant de supprimer un projet de l'api
async function supProjet(id, title) {
  const supErrorMsg = document.getElementById("sup-error");
  supErrorMsg.textContent = "";
  const confirmation = confirm(
    `Êtes-vous sûr de vouloir supprimer le projet ${title} ?`,
  );
  if (!confirmation) {
    return;
  }
  try {
    const tokenActuel = sessionStorage.getItem("token");
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${tokenActuel}` },
    });
    if (response.ok) {
      // Mettre à jour la liste des projets après la suppression
      const indexProjet = works.findIndex((work) => work.id === id);
      if (indexProjet === -1) {
        return;
      }
      works.splice(indexProjet, 1);
      displayProjets(works);
      displayGalleryModale(works);
    } else if (response.status === 401) {
      supErrorMsg.textContent = "Session expirée, veuillez vous reconnecter";
    } else {
      supErrorMsg.textContent =
        "Une erreur est survenue lors de la suppression du projet";
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du projet :", error);
    supErrorMsg.textContent =
      "Une erreur est survenue, veuillez réessayer plus tard";
  }
}

// ---------------- Modale 2: Vue ajout photo ------------------

const fileInput = document.getElementById("photo");
const champPhoto = document.querySelector(".ajout-photo-form");
const image = document.getElementById("image-form");
const modale2Form = document.getElementById("modale2-form");
const formSubmitErrorMsg = document.getElementById("form-submit-error");
const PHOTO_TAILLE_MAX = 4 * 1024 * 1024;

// Affichage de la preview de l'image dans le formulaire
fileInput.addEventListener("change", () => {
  if (fileInput.files[0] === undefined) {
    return;
  }
  const file = fileInput.files[0];
  const imageURL = URL.createObjectURL(file);
  image.src = imageURL;
  for (const enfant of champPhoto.children) {
    enfant.classList.add("hidden");
  }
  image.classList.remove("hidden");
});

// Event sur le bouton Valider du formulaire de la modale2
modale2Form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formSubmitErrorMsg.textContent = "";
  formSubmitErrorMsg.classList.remove("correct");
  // Récupération des entrées du form
  const fichier = modale2Form.photo.files[0];
  const titre = modale2Form.titre.value;
  const categorie = modale2Form.categorie.value;
  // Vérification des conditions sur les entrées
  if (fichier === undefined) {
    formSubmitErrorMsg.textContent = "Veuillez ajouter une photo";
    return;
  }
  if (fichier.type !== "image/jpeg" && fichier.type !== "image/png") {
    formSubmitErrorMsg.textContent =
      "Le fichier est au mauvais format (.jpg ou .png)";
    return;
  }
  if (fichier.size > PHOTO_TAILLE_MAX) {
    formSubmitErrorMsg.textContent = "Fichier trop lourd ( > 4 Mo )";
    return;
  }
  if (titre.trim() === "") {
    formSubmitErrorMsg.textContent = "Veuillez ajouter un titre";
    return;
  }
  if (categorie === "") {
    formSubmitErrorMsg.textContent = "Veuillez choisir une catégorie";
    return;
  }
  // Création d'un formData avec les entrées
  const formData = new FormData();
  formData.append("image", fichier);
  formData.append("title", titre.trim());
  formData.append("category", categorie);
  // Envoie d'une requête à l'api avec le formData
  try {
    const tokenActuel = sessionStorage.getItem("token");
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenActuel}` },
      body: formData,
    });
    if (response.ok) {
      const resultat = await response.json();
      // Ajout du nouveau projet dans works
      resultat.categoryId = Number(resultat.categoryId);
      works.push(resultat);
      // Réaffichage des projets et reset du formulaire
      displayProjets(works);
      displayGalleryModale(works);
      resetFormPhoto();
      formSubmitErrorMsg.classList.add("correct");
      formSubmitErrorMsg.textContent = `Ajouté : ${titre.trim()}`;
    } else if (response.status === 401) {
      formSubmitErrorMsg.textContent =
        "Session expirée, veuillez vous reconnecter";
    } else {
      formSubmitErrorMsg.textContent =
        "Une erreur est survenue, veuillez réessayer plus tard";
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du projet :", error);
    formSubmitErrorMsg.textContent =
      "Une erreur est survenue, veuillez réessayer plus tard";
  }
});

// Fonction qui réinitialise le formulaire de la modale
function resetFormPhoto() {
  for (const enfant of champPhoto.children) {
    enfant.classList.remove("hidden");
  }
  image.classList.add("hidden");
  image.src = "";
  formSubmitErrorMsg.textContent = "";
  modale2Form.reset();
}

// Récupération de la liste des catégories pour le select dans la modale
const categorieModale = document.querySelector("#categorie");

for (let i = 0; i < categories.length; i++) {
  const optionCategorie = document.createElement("option");
  optionCategorie.value = categories[i].id;
  optionCategorie.textContent = categories[i].name;
  categorieModale.appendChild(optionCategorie);
}


