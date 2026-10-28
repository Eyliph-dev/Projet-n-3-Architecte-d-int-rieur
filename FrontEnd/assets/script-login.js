const submitForm = document.querySelector("form");

// Récupération de l'email et mdp de l'utilisateur et envoi de la requête vers l'api
submitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const userEmail = document.getElementById("email");
  const userPassword = document.getElementById("password");
  const infoForm = {
    email: userEmail.value,
    password: userPassword.value,
  };

  const chargeUtile = JSON.stringify(infoForm);
  login(chargeUtile);
});

// Vérification de l'email et mdp de l'utilisateur
async function login(chargeUtile) {
  const errorMsg = document.getElementById("error");
  errorMsg.textContent = "";
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: chargeUtile,
  });

  if (response.status === 200) {
    const userValid = await response.json();
    sessionStorage.setItem("token", userValid.token);
    window.location.href = "index.html";
  } else if (response.status === 401 || response.status === 404) {
    errorMsg.textContent = "Email ou mot de passe incorrect";
  } else {
    errorMsg.textContent =
      "Une erreur est survenue, veuillez réessayer plus tard";
  }
}
