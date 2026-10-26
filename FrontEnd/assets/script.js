


// Récupération des projets depuis l'api
const responseWorks = await fetch("http://localhost:5678/api/works");
const works = await responseWorks.json();




function displayProjets (works){
    //  Effacer le code html des projets
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = '';

    //  Ajout des projets dans le code html
    for (let i = 0; i < works.length; i++){

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


// Récupération des catégories depuis l'api
const responseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responseCategories.json();



// Création de la liste des Filtres dans le html
const filtres = document.querySelector(".filtres");
const listeFiltres = document.createElement("ul");
filtres.appendChild(listeFiltres);




function createFiltre (nomFiltre, idFiltre){
    const elementFiltres = document.createElement("li");
    const filtresButton = document.createElement("button");
    filtresButton.textContent = nomFiltre;
    listeFiltres.appendChild(elementFiltres);
    elementFiltres.appendChild(filtresButton);

    if(idFiltre === 0){
        filtresButton.classList.add("filtre-actuel");
    }

    filtresButton.addEventListener("click", () => {
        if(idFiltre === 0){
            displayProjets(works);
        } else {
            const projetFiltered = works.filter((work) => work.categoryId === idFiltre);
            displayProjets(projetFiltered);
        }

        const allButtons = document.querySelectorAll(".filtres button");
        for(let i = 0; i < allButtons.length; i++){
            allButtons[i].classList.remove("filtre-actuel");
        }
        filtresButton.classList.add("filtre-actuel");
    })

}

// Création des Filtres
createFiltre("Tous", 0);
for (let i = 0; i < categories.length; i++){
    createFiltre(categories[i].name, categories[i].id);
}





