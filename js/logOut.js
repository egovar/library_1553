const exit_button = document.getElementById("exit");

function logOut(){
    localStorage.clear();
    window.location = "./index.html"
}

exit_button.addEventListener("click", logOut)