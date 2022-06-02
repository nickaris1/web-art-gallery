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

document.querySelector(".EventButton").onclick = () => {
    window.location.replace("Events.html");
}

fetch("/api/getAvailableEvents").then((eventRequest) => {
    eventRequest.json().then((eventList) => {
        const event = eventList[0];
        console.log(event);

        const doc = `Event Name: ${event.Name}<br>Address: ${event.Address}<br>${event.StartDate.substring(0, 10)} - ${event.EndDate.substring(0, 10)}<br>`;
        console.log(doc)
        document.querySelector(".Content .Events").innerHTML = doc;

        document.querySelector(".EventButton").onclick = () => {
            window.location.replace("Events.html?id=" + event.id);
        }


        fetch("/api/getEventCollection?id=" + event.id).then((EVresponse) => {
            if (EVresponse.status === 200) {
                EVresponse.json().then((EVdata) => {
                    fetch("/api/imagesForCollection?id=" + EVdata[0].CollectionID).then((imgResponse) => {
                        imgResponse.json().then((imgData) => {
                            const path = imgData[0].Src_path.replace("%0", "/").replace("\\", "/");
                            console.log()
            
                            document.querySelector(".Events_and_Exhibitions").style.backgroundImage = "url('" + path + "')";
                        });
                    });
                })
            }
        })
    })
});