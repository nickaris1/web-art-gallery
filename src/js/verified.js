verifier();

function verifyUser(ulr) {
    return new Promise(resstatus => {
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function() {
            if (this.readyState === this.DONE) {
                resstatus(this.status);
            }
        }
        xmlHttp.open("GET", ulr);
        xmlHttp.send();
    });
}


async function verifier() {
    const loginBtn = document.querySelector("#id_loginBtn");

    const response_code = await verifyUser("/api/verify");

    if (response_code === 200 || response_code === 202) {
        loginBtn.innerHTML = "log out";
        loginBtn.setAttribute("href", "/logout.html");
    } else {
        loginBtn.innerHTML = "login";
        loginBtn.setAttribute("href", "/api/login.html");
    }

    const dashboardBtn = document.querySelector("#id_dashboardBtn");
    if (response_code === 202) {
        dashboardBtn.style.display = "inline";
    } else {
        dashboardBtn.style.display = "none";
    }
}