// Récupération des projets depuis l'api
const responseWorks = await fetch("http://localhost:5678/api/works");
export const works = await responseWorks.json();

// Récupération des catégories depuis l'api
const responseCategories = await fetch("http://localhost:5678/api/categories");
export const categories = await responseCategories.json();