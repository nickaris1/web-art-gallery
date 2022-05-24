//=================================================================
// Add artist to artist select input

const artistSelect = document.querySelector("#id_artistSelect");
const xhrArtistSelect = new XMLHttpRequest();
xhrArtistSelect.open("GET", "/api/getArtist", true);
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
const collectionListEventSelect = document.querySelector("#id_collectionListSelect");

const xhrCollectionSelect = new XMLHttpRequest();
xhrCollectionSelect.open("GET", "/api/getCollection", true);
xhrCollectionSelect.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const myArr = JSON.parse(this.responseText);
        let count = 0;
        myArr.forEach(element => {
            const selectElement = document.createElement("option");
            selectElement.value = element.Name;
            selectElement.innerText = element.Name;
            collectionSelect.appendChild(selectElement);


            // create list for Events
            const listElement = document.createElement("div");
            const checkBox = document.createElement("input");
            checkBox.id = `id_cb${count}`;
            checkBox.type = "checkbox";
            checkBox.name = "collections";
            checkBox.value = element.Name;
            const checkBoxLabel = document.createElement("label");
            checkBoxLabel.for = `id_cb${count}`;
            checkBoxLabel.textContent = element.Name;
            listElement.appendChild(checkBox);
            listElement.appendChild(checkBoxLabel);
            collectionListEventSelect.appendChild(listElement);
            
            count++;
        });
    }
}
xhrCollectionSelect.send();

// ===============================================================
// User

const userList = document.querySelector("#id_userList");
const xhrUserList = new XMLHttpRequest();
xhrUserList.open("GET", "/api/getUsers", true);
xhrUserList.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const myArr = JSON.parse(this.responseText);
        myArr.forEach((user) => {
            const listItem = document.createElement("li");
            
            const id = document.createElement("p");
            id.textContent = user.id;
            listItem.appendChild(id);
            
            const name = document.createElement("p");
            name.textContent = user.Name;
            listItem.appendChild(name);
            const email = document.createElement("p");
            email.textContent = user.Email;
            listItem.appendChild(email);
            const removeBtn = document.createElement("input");
            removeBtn.value = "delete"
            listItem.appendChild(removeBtn);

            userList.appendChild(listItem);
            removeBtn.addEventListener('click', (event) => {
                
                const deleteUserRequest = new XMLHttpRequest();
                deleteUserRequest.open("POST", "/api/deleteUser", true);
                deleteUserRequest.onreadystatechange = function () { // Call a function when the state changes.
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                        userList.removeChild(listItem);
                        alert(`user ${user.id} deleted`);
                    } else if (this.readyState === XMLHttpRequest.DONE && this.status === 401) {
                        alert("Unauthorized Action.");
                    }
                }
                const formdata = new FormData();
                formdata.append("id", user.id);
                deleteUserRequest.send(formdata);
            });
        });
    }
}
xhrUserList.send();




//=================================================================


//=================================================================
// Form Manipulation
const form_el = document.querySelector("#id_addImageForm");
form_el.onsubmit = function (event) {
    event.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload", true);

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
    xhr.open("POST", "/api/addArtist", true);

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



const addEventForm = document.querySelector("#id_addEventForm");
addEventForm.onsubmit = function (event) {
    event.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/addEvent", true);

    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            alert("Event added");

            window.location.replace("/dashboard.html");
        } else if (this.readyState === XMLHttpRequest.DONE && this.status === 404) {
            alert("Error");
        } else if (this.readyState === XMLHttpRequest.DONE && this.status === 401) {
            alert("Unauthorized Action.");
        }
    }
    const formdata = new FormData(addEventForm);
    const startDate = new Date(formdata.get("startDate"));
    const endDate = new Date(formdata.get("endDate"));
    const maxTickets = formdata.get("maxTickets");
    const collections = formdata.getAll("collections");

    if (maxTickets > 0 && startDate <= endDate && collections.length > 0) {
        xhr.send(formdata);
    } else {
        alert("Missing data");
    }
    
    return false;
}