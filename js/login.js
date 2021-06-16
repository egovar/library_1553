const auth_Form = document.getElementById("auth");

function Auth(e){
    e.preventDefault();
    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;
    fetch("/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            login: login,
            pass: password
        })
    })
        .then((result) => {
            if (result.ok) {
                result.json()
                    .then((res) => {
                        localStorage.setItem("jwt", res.jwt);
                        localStorage.setItem("login", login);
                        localStorage.setItem("password", password);
                        localStorage.setItem("id", res.seller?.id || res.teacher?.id);
                        RoleRelocate(res);
                    })
                } else {
                    alert('Неверный логин/пароль');
                }
            })
}

if (localStorage.getItem("login") !== null){
    fetch("/api/users/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            login: localStorage.getItem("login"),
            pass: localStorage.getItem("password")
        })
    }).then((result) => result.json()
        .then((res) => {
            localStorage.setItem("jwt", res.jwt);
            RoleRelocate(res);
        }))
}

function RoleRelocate (auth_object) {
    if (auth_object['is_admin']){
        localStorage.setItem("role", "admin");
        window.location = "./admin.html"
    }
    else if ("teacher" in auth_object){
        localStorage.setItem("role", "teacher");
        window.location = "./teacher.html"
    }
    else{
        localStorage.setItem("role", "student")
        window.location = "./student.html"
    }
}

const site = document.getElementById("web-site");
site.addEventListener("click", () => {
    window.location = "https://www.lit.msu.ru/"
})


auth_Form.addEventListener("submit", (e) => Auth(e));