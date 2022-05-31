const imageList = []
const collectionList = document.querySelector("#id_collectionList");

const descPanel = document.querySelector("#id_description");
const selectedImg = document.querySelector("#selected");
const imgName = document.querySelector("#id_ImageName")
const thumbnails = document.querySelector(".thumbnails")

fetch("/api/getEvents").then((response) => {
    if (response.status === 200) {
        response.json().then((data) => {
            data.forEach(item => {
                const newCollection = document.createElement("li");

                const link = document.createElement("a");
                link.textContent = item.Name;
                link.collectionId = item.id;
                newCollection.addEventListener('click', (e) => {
                    showCollection(item.id);
                });
                newCollection.appendChild(link);
                collectionList.appendChild(newCollection);

            });
        });
    }
}).catch(err => console.error)

const urlstr = window.location.href;
if (urlstr.includes('?')) {
    console.log('Parameterised URL');
    const url = new URL(urlstr);
    const id = url.searchParams.get("id");
    showCollection(id);
} else {
    console.log('No Parameters in URL');
}

function showCollection(id) {
    fetch("/api/getCollectionById?id=" + id).then((response) => {
        if (response.status === 200) {
            response.json().then((data) => {
                document.querySelector("#collectionName").textContent = "Collection Name: " + data.Name;
                document.querySelector("#collectionDescription").textContent = "Collection Description: " + data.Description;
                fetch("/api/getArtistById?id=" + data.ArtistID).then((artistRes) => {
                    artistRes.json().then((artistData) => {
                        document.querySelector("#artistName").textContent = "Artist Name: " + artistData.Name;
                    });
                }).catch(err => console.error);

                fetch("/api/imagesForCollection?id=" + id).then((imgResponse) => {
                    imgResponse.json().then((imgData) => {
                        const imgPromises = []
                        imgData.forEach((image) => {
                            imgPromises.push(new Promise((resolve, reject) => {
                                const img = new Image();
                                img.id = image.id;
                                img.Name = image.Name;
                                img.Description = image.Description;
                                img.addEventListener('click', imgActivate);
                                img.onload = (e) => {
                                    resolve(img);
                                }
                                img.src = image.Src_path;
                            }));
                        });
                        thumbnails.innerHTML = "";
                        Promise.all(imgPromises).then((imgArray) => {
                            imgArray.forEach((img)=>{
                                imageList.push(img);
                                thumbnails.appendChild(img);
                            });
                            imgArray[0].click();
                        });
                    });
                }).catch(err => console.error);
            });
        }
    }).catch(err => console.error);
}


function imgActivate(e) {
    selectedImg.src = this.src;
    selectedImg.title = this.Name;
    descPanel.textContent = this.Description;
    imgName.textContent = this.Name;

    imageList.forEach(img => { img.classList.remove("activeThumb"); })
    this.classList.add("activeThumb");
}