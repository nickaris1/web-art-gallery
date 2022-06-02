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
                const newEvent = document.createElement("li");

                const link = document.createElement("a");
                link.textContent = item.Name;
                link.collectionId = item.id;
                newEvent.addEventListener('click', (e) => {
                    showCollection(item.id);
                });
                newEvent.appendChild(link);
                collectionList.appendChild(newEvent);

            });
        });
    }
}).catch(err => console.error)

const urlstr = window.location.href;
if (urlstr.includes('?')) {
    console.log('Parameterised URL');
    const url = new URL(urlstr);
    const id = url.searchParams.get("id");
    showEvent(id);
} else {
    console.log('No Parameters in URL');
}

function showEvent(id) {
    fetch("/api/getEventById?id=" + id).then((response) => {
        if (response.status === 200) {
            response.json().then((data) => {
                document.querySelector("#EventName").textContent = "Event Name: " + data.Name;
                document.querySelector("#EventAddress").textContent = "Event Address: " + data.Address;
                
                document.querySelector("#EventStart").textContent = "Start Date: " + data.StartDate;
                document.querySelector("#EventEnd").textContent = "End date: " + data.EndDate;
                document.querySelector("#MaxTickets").textContent = "Max Tickets: " + data.Description;
                document.querySelector("#ReserveTickets").textContent = "reservedTickets:"  + data.reservedTickets;

                
                fetch("/api/getEventCollection?id=" + id).then((EVresponse) => {
                    if (EVresponse.status === 200) {
                        EVresponse.json().then((EVdata) => {
                            EVdata.forEach(eventColleciton=>{
                                fetch("/api/getCollectionById?id=" + eventColleciton.CollectionID).then((collectionResponse) =>{
                                    if (collectionResponse.status === 200) {
                                        collectionResponse.json().then(

                                        )
                                    }
                                }

                                ).catch(err=>console.err)
                            })
                        })
                    }
                }).catch(err=>console.error)


            });
        }
    }).catch(err => console.error);
}


