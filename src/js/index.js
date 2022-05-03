

const loginBtn = document.querySelector("#id_loginBtn");

const response_code = httpGet("/verify");

if (response_code === 200 || response_code === 202) {
    loginBtn.innerHTML = "log out";
    loginBtn.setAttribute("href", "/logout.html");
} else {
    loginBtn.innerHTML = "login";
    loginBtn.setAttribute("href", "/login.html");
}

const dashboardBtn = document.querySelector("#id_dashboardBtn");
if (response_code === 202) {
    dashboardBtn.style.display = "inline";
} else {
    dashboardBtn.style.display = "none";
}

function httpGet(ulr) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", ulr, false); // false for synchronous request
    xmlHttp.send();
    return xmlHttp.status;
}