const loginBtn = document.querySelector("#id_loginBtn");
const form = document.querySelector("#id_loginForm")

loginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    fetch("/api/login", { method: "POST", body: data }).then((response) => {
        if (response.status === 200) {
            window.location.replace("index.html");
        } else {
            alert("Invalid Email or passowrd");
        }
    }).catch(err => console.error("Error" + err));
    return false;
});