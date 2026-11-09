import { works, categories } from "./data.js";

// --------------------- Affichage des projets et filtres ------------------

// Fonction affichant les travaux
export function displayProjets(worksToDisplay) {
  //  Effacer le code html des projets
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  //  Ajout des projets dans le code html
  for (let i = 0; i < worksToDisplay.length; i++) {
    const figure = document.createElement("figure");

    const imgElement = document.createElement("img");
    imgElement.src = worksToDisplay[i].imageUrl;
    imgElement.alt = worksToDisplay[i].title;

    const captionElement = document.createElement("figcaption");
    captionElement.textContent = worksToDisplay[i].title;

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
