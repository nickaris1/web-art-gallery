const imageList = []
const eventList = document.querySelector("#id_EventList");

const descPanel = document.querySelector("#id_description");
const selectedImg = document.querySelector("#selected");
const imgName = document.querySelector("#id_ImageName")
const thumbnails = document.querySelector(".thumbnails")

const reserveBtn = document.querySelector("#id_reserve");

fetch("/api/getEvents").then((response) => {
    if (response.status === 200) {
        response.json().then((data) => {
            data.forEach(item => {
                const newEvent = document.createElement("li");

                const link = document.createElement("a");
                link.textContent = item.Name;
                link.eventId = item.id;
                newEvent.addEventListener('click', (e) => {
                    showEvent(item.id);
                });
                newEvent.appendChild(link);
                eventList.appendChild(newEvent);

            });

            const urlstr = window.location.href;
            if (urlstr.includes('?')) {
                console.log('Parameterised URL');
                const url = new URL(urlstr);
                const id = url.searchParams.get("id");
                console.log(id)
                showEvent(parseInt(id, 10));
            } else {
                console.log('No Parameters in URL');
                eventList.childNodes[1].click();
            }
        });
    }
}).catch(err => console.error)



function showEvent(id) {
    document.querySelector("#id_collectionList").innerHTML = "";
    fetch("/api/getEventById?id=" + id).then((response) => {
        if (response.status === 200) {
            response.json().then((data) => {
                console.log(data);
                data = data[0];
                console.log(data);
                document.querySelector("#EventName").textContent = "Event Name: " + data.Name;
                document.querySelector("#EventAddress").textContent = "Event Address: " + data.Address;

                document.querySelector("#EventStart").textContent = "Start Date: " + data.StartDate;
                document.querySelector("#EventEnd").textContent = "End date: " + data.EndDate;
                document.querySelector("#MaxTickets").textContent = "Max Tickets: " + data.MaxTickets;
                document.querySelector("#ReserveTickets").textContent = "reservedTickets:" + data.reservedTickets;


                verifyUser("/api/verify").then((responseCode) => {
                    reserveBtn.data = data;
                    reserveBtn.eventid = id;
                    if (responseCode === 200 || responseCode === 202) {
                        if (data.isReserved) {
                            reserveBtn.value = "Cancel";
                            reserveBtn.addEventListener('click', cancelEvent);
                        } else {
                            reserveBtn.value = "Reserve";

                            reserveBtn.addEventListener('click', reserveEvent);
                        }
                    } else {
                        reserveBtn.value = "Reserve";
                        reserveBtn.addEventListener('click', (e) => { window.location.replace("login.html"); });
                    }
                });


                fetch("/api/getEventCollection?id=" + id).then((EVresponse) => {
                    if (EVresponse.status === 200) {
                        EVresponse.json().then((EVdata) => {
                            EVdata.forEach(eventColleciton => {
                                fetch("/api/getCollectionById?id=" + eventColleciton.CollectionID).then((collectionResponse) => {
                                    if (collectionResponse.status === 200) {
                                        collectionResponse.json().then((collectionData) => {
                                            const collectionItem = document.createElement("li");

                                            const collectionLink = document.createElement("a");
                                            collectionLink.textContent = collectionData.Name;
                                            collectionLink.href = "/collections.html?id=" + collectionData.id;

                                            collectionItem.appendChild(collectionLink);
                                            document.querySelector("#id_collectionList").appendChild(collectionItem);
                                        });
                                    }
                                }).catch(err => console.err)
                            });
                        });
                    }
                }).catch(err => console.error);
            });
        }
    }).catch(err => console.error);
}

function cancelEvent(e) {
    cancelListener(e.target.data.id);
}

function reserveEvent(e) {
    reserveListener(e.target.data.id);
}

function reserveListener(eventId) {
    const data = new FormData();
    data.append("EventId", eventId);
    fetch("/api/reserveEvent", { method: "POST", body: data }).then((response) => {
        if (response.status === 200) {
            reserveBtn.value = "cancel";
            reserveBtn.removeEventListener('click', reserveEvent);
            reserveBtn.addEventListener('click', cancelEvent);
            updateTicketCount(eventId);
        } else {
            alert("Error");
        }
    }).catch(err => console.error("Error" + err));
}


function cancelListener(eventId) {
    const data = new FormData();
    data.append("EventId", eventId);
    fetch("/api/cancelEvent", { method: "POST", body: data }).then((response) => {
        if (response.status === 200) {
            reserveBtn.value = "Reserve";
            reserveBtn.removeEventListener('click', cancelEvent);
            reserveBtn.addEventListener('click', reserveEvent);
            updateTicketCount(eventId);
        } else {
            alert("Error");
        }
    }).catch(err => console.error("Error" + err));
}

function updateTicketCount(eventId) {
    fetch("/api/getEventById?id=" + eventId).then((response) => {
        if (response.status === 200) {
            response.json().then((data) => {
                data = data[0];
                document.querySelector("#ReserveTickets").textContent = "reservedTickets:" + data.reservedTickets;
            });
        }
    });
}