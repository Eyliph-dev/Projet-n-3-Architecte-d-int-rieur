// Récupération des projets depuis l'api
const responseWorks = await fetch("http://localhost:5678/api/works");
let works = await responseWorks.json();

// Récupération des catégories depuis l'api
const responseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responseCategories.json();

// ----------- Mode édition --------------

// Récupération du token
const token = sessionStorage.getItem("token");

const log = document.querySelector(".login");

// Suppression du token lors du click sur "logout"
log.addEventListener ("click", () => {
  sessionStorage.removeItem("token");
});

editPage(token);

// Fonction permettant de changer la page en mode édition
function editPage (token) {
  const edit = document.body;

  if (token !== null){
    edit.classList.add("edit");
    log.textContent = "logout";
    log.setAttribute("href", "index.html");
  } else {
    log.textContent = "login";
  }
}

// -------------- Modale ------------------

// Récupération de la liste des catégories pour le select dans la modale
const categorieModale = document.querySelector("#categorie");

for (let i = 0; i < categories.length; i++) {
  const optionCategorie = document.createElement("option");
  optionCategorie.value = categories[i].id;
  optionCategorie.textContent = categories[i].name;
  categorieModale.appendChild(optionCategorie);
}

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
    supElement.setAttribute("aria-label", `Supprimer le projet ${works[i].title}`);
    const imgSupElement = document.createElement("i");
    imgSupElement.classList.add("fa-solid", "fa-trash-can");
    supElement.appendChild(imgSupElement);
    // Récupération de l'id du projet à supprimer lors du click sur le bouton de suppression
    supElement.addEventListener("click", () => {
      const id = works[i].id;
      supProjet(id);
    });

    // Ajout des éléments dans le html
    galleryModale.appendChild(figure);
    figure.appendChild(imgElement);
    figure.appendChild(supElement);
  }
}

displayGalleryModale(works);

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
document.querySelectorAll(".closeModale").forEach(button => {
  button.addEventListener("click", () => {
    modale.close();
  });
});

// Fermeture modale si clic en dehors
modale.addEventListener("click", event => {
  if(event.target === modale){
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

// Fonction permettant de supprimer un projet de l'api
async function supProjet(id) {
  const supErrorMsg = document.getElementById("sup-error");
  supErrorMsg.textContent = "";
  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
  if (!confirmation) {
    return;
  }
  try {
    const tokenActuel = sessionStorage.getItem("token");
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${tokenActuel}` },
    });
    if (response.ok) {
      // Mettre à jour la liste des projets après la suppression
     works = works.filter(work => work.id !== id);
     displayProjets(works);
     displayGalleryModale(works);
    } else if (response.status === 401) {
      supErrorMsg.textContent = "Session expirée, veuillez vous reconnecter";
    } else {
      supErrorMsg.textContent = "Une erreur est survenue lors de la suppression du projet";
    }
  } catch (error) {
  console.error("Erreur lors de la suppression du projet :", error);
  supErrorMsg.textContent = "Une erreur est survenue, veuillez réessayer plus tard";
  }
}

// --------------------- Affichage des projets et filtres ------------------

// Fonction affichant les travaux
function displayProjets(works) {
  //  Effacer le code html des projets
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  //  Ajout des projets dans le code html
  for (let i = 0; i < works.length; i++) {
    const figure = document.createElement("figure");

    const imgElement = document.createElement("img");
    imgElement.src = works[i].imageUrl;
    imgElement.alt = works[i].title;

    const captionElement = document.createElement("figcaption");
    captionElement.textContent = works[i].title;

    gallery.appendChild(figure);
    figure.appendChild(imgElement);
    figure.appendChild(captionElement);
  }
}

displayProjets(works);

// Création de la liste des Filtres dans le html
const filtres = document.querySelector(".filtres");
const listeFiltres = document.createElement("ul");
filtres.appendChild(listeFiltres);

// Fonction créant les boutons filtres
function createFiltre(nomFiltre, idFiltre) {
  const elementFiltres = document.createElement("li");
  const filtresButton = document.createElement("button");
  filtresButton.textContent = nomFiltre;
  listeFiltres.appendChild(elementFiltres);
  elementFiltres.appendChild(filtresButton);

  if (idFiltre === 0) {
    filtresButton.classList.add("filtre-actuel");
  }
  // Ajout d'un event listener sur les boutons filtres
  filtresButton.addEventListener("click", () => {
    if (idFiltre === 0) {
      displayProjets(works);
    } else {
      const projetFiltered = works.filter(
        (work) => work.categoryId === idFiltre,
      );
      displayProjets(projetFiltered);
    }

    const allButtons = document.querySelectorAll(".filtres button");
    for (let i = 0; i < allButtons.length; i++) {
      allButtons[i].classList.remove("filtre-actuel");
    }
    filtresButton.classList.add("filtre-actuel");
  });
}

createFiltre("Tous", 0);
for (let i = 0; i < categories.length; i++) {
  createFiltre(categories[i].name, categories[i].id);
}

