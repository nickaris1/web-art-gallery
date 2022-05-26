
const collectionList = document.querySelector("#id_collectionList");

fetch("/api/getCollections").then((response) => {
    if (response.status === 200) {
        response.json().then((data) => {
            data.forEach(item => {
                const newCollection = document.createElement("li");
                newCollection.textContent = item.Name;
                newCollection.collectionId = item.id;
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
    fetch("/api/getCollectionById?id=" + id).then((response) => {
        if (response.status === 200) {
            response.json().then((data) => {
                document.querySelector("#collectionName").textContent = "Collection Name: " + data.Name;
                document.querySelector("#collectionDescription").textContent = "Collection Description: " + data.Description;
                fetch("/api/getArtistById?id=" + data.ArtistID).then((artistRes) => {
                    artistRes.json().then((artistData) => {
                        document.querySelector("#artistName").textContent = "Artist Name: " + artistData.Name;
                    });
                }).catch(err=>console.error);
            });
        }
    }).catch(err => console.error);
} else {
    console.log('No Parameters in URL');
}