//=================================================================
// Add artist to artist select input

const artistSelect = document.querySelector("#id_artistSelect");
const xhrArtistSelect = new XMLHttpRequest();
xhrArtistSelect.open("GET", "/getArtist", true);
xhrArtistSelect.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const myArr = JSON.parse(this.responseText);
        myArr.forEach(element => {
            const selectElement = document.createElement("option");
            selectElement.value = element.Name;
            selectElement.innerText = element.Name;
            artistSelect.appendChild(selectElement);
        });
    }
}
xhrArtistSelect.send();

//===============================================================

const collectionSelect = document.querySelector("#id_collectionSelect");
const xhrCollectionSelect = new XMLHttpRequest();
xhrCollectionSelect.open("GET", "/getCollection", true);
xhrCollectionSelect.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const myArr = JSON.parse(this.responseText);
        myArr.forEach(element => {
            const selectElement = document.createElement("option");
            selectElement.value = element.Name;
            selectElement.innerText = element.Name;
            collectionSelect.appendChild(selectElement);
        });
    }
}

xhrCollectionSelect.send();


//=================================================================


//=================================================================
// Form Manipulation
const form_el = document.querySelector("#id_addImageForm");
form_el.onsubmit = function (event) {
    event.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);

    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            alert("Image added");

            window.location.replace("/dashboard.html");
        } else if (this.readyState === XMLHttpRequest.DONE && this.status === 404) {
            alert("Error");
        } else if (this.readyState === XMLHttpRequest.DONE && this.status === 101) {
            alert("Image already exists");
        }
    }
    xhr.send(new FormData(form_el));
    return false;
}


const addArtistForm = document.querySelector("#id_addArtistForm");
addArtistForm.onsubmit = function (event) {
    event.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/addArtist", true);

    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            alert("Artist added");

            window.location.replace("/dashboard.html");
        } else if (this.readyState === XMLHttpRequest.DONE && this.status === 404) {
            alert("Error");
        }
    }
    xhr.send(new FormData(addArtistForm));
    return false;
}

const addCollectionForm = document.querySelector("#id_addCollectionForm");
addCollectionForm.onsubmit = function (event) {
    event.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/addCollection", true);

    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            alert("Collection added");

            window.location.replace("/dashboard.html");
        } else if (this.readyState === XMLHttpRequest.DONE && this.status === 404) {
            alert("Error");
        }
    }
    xhr.send(new FormData(addCollectionForm));
    return false;
}


