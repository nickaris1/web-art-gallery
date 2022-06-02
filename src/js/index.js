fetch("/api/getCollections").then((collectionRequest) => {
    collectionRequest.json().then(collections => {
        const data = collections[0];
        const cc_collections = document.querySelector("#cc_collections");

        fetch("/api/getArtistById?id=" + data.ArtistID).then((artistRes) => {
            artistRes.json().then((artistData) => {
                let doc = `<strong><em>${artistData.Name}</em></strong><br>${data.Name}<br>${data.Description}`;
                cc_collections.innerHTML = doc;
            });
        }).catch(err => console.error);

        fetch("/api/imagesForCollection?id=" + data.id).then((imgResponse) => {
            imgResponse.json().then((imgData) => {
                const path = imgData[0].Src_path.replace("%0", "/").replace("\\", "/");
                console.log()

                document.querySelector(".Current_Collection").style.backgroundImage = "url('" + path + "')";
            });
        });
        
        document.querySelector(".CollectionButton").onclick = () => { window.location.replace("collections.html?id=" + data.id); }
    });
});

document.querySelector(".CollectionButton").onclick = () => {
    window.location.replace("collections.html");
}

