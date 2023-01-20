// Select DOM elements to work with
const welcomeDiv = document.getElementById("WelcomeMessage");
const signInButton = document.getElementById("SignIn");
// const cardDiv = document.getElementById("card-div");
// const mailButton = document.getElementById("readMail");
// const profileButton = document.getElementById("seeProfile");
// const profileDiv = document.getElementById("profile-div");

function showWelcomeMessage(username) {
    // Reconfiguring DOM elements
    // cardDiv.style.display = 'initial';
    welcomeDiv.innerHTML = `Welcome ${username}`;
    signInButton.setAttribute("onclick", "signOut();");
    signInButton.setAttribute('class', "btn btn-success")
    signInButton.innerHTML = "Sign Out";
    loader()
}

