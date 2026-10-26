


// Récupération des projets depuis l'api
const responseWorks = await fetch("http://localhost:5678/api/works");
const works = await responseWorks.json();


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




// Récupération des catégories depuis l'api
const responseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responseCategories.json();



// Création de la liste des Filtres
const filtres = document.querySelector(".filtres");
const listeFiltres = document.createElement("ul");
filtres.appendChild(listeFiltres);


// Création Filtre Tous
const elementTous = document.createElement("li");
const elementTousContent = document.createElement("p");
elementTousContent.textContent = "Tous";
listeFiltres.appendChild(elementTous);
elementTous.appendChild(elementTousContent);


// Création des autres Filtres depuis les catégories de l'api
for (let i = 0; i < categories.length; i++){

    const elementFiltres = document.createElement("li");

    const elementFiltresContent = document.createElement("p");

    elementFiltresContent.textContent = categories[i].name;

    listeFiltres.appendChild(elementFiltres);
    elementFiltres.appendChild(elementFiltresContent);
}

