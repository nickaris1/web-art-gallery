const registerForm = document.querySelector("#id_registerForm");
const passRef = document.querySelector("#id_password");
const passRepeatRef = document.querySelector("#id_passwordRepeat");

registerForm.onsubmit = function(event) {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/register", true);
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            window.location.replace("/login.html");
        } else if (this.readyState === XMLHttpRequest.DONE && this.status === 404) {
            alert("User Exists!");
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    const data = {
        email: document.querySelector("#id_email").value,
        name: document.querySelector("#id_name").value,
        phone: document.querySelector("#id_phone").value,
        pass: passRef.value
    };
    
    xhr.send(JSON.stringify(data));
    return false;
}
