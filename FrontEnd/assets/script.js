


// Récupération des projets depuis l'api
const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();


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