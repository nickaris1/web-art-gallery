

const loginBtn = document.querySelector("#id_loginBtn");

const cookie = document.cookie;
// console.log(cookie);
if (cookie != ""){
    loginBtn.innerHTML = "log out";
    loginBtn.setAttribute("href", "/logout.html");
} else {
    loginBtn.innerHTML = "login";
    loginBtn.setAttribute("href", "/login.html");
}