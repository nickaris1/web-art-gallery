
const buttonAdd = document.querySelector(".buttonAdd");
const content =  document.querySelector(".content");

buttonAdd.addEventListener("click", function () {

    content.classList.add("content");

    const descDiv = document.createElement("div");
    descDiv.setAttribute("div", "CollectionInfo");
    descDiv.classList.add("CollectionInfo");
    descDiv.textContent = "Collection description will be here";
    content.appendChild(descDiv);

    const selColDiv = document.createElement("div");
    selColDiv.setAttribute("div", "SelectedCollection");
    selColDiv.classList.add("SelectedCollection");
    selColDiv.textContent = "Collection image will be here";
    content.appendChild(selColDiv);

});
