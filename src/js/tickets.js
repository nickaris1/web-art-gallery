const eventList = document.querySelector("#id_events_list");

createEventList();


function createEventList() {
    const xhrEventList = new XMLHttpRequest();
    xhrEventList.open("GET", "/api/getAvailableEvents", true);
    xhrEventList.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            eventList.innerHTML = "";
            const myArr = JSON.parse(this.responseText);
            myArr.forEach((event) => {
                const listItem = document.createElement("li");

                const id = document.createElement("p");
                id.textContent = event.id;
                listItem.appendChild(id);

                const name = document.createElement("p");
                name.textContent = event.Name;
                listItem.appendChild(name);

                const address = document.createElement("p");
                address.textContent = event.Address;
                listItem.appendChild(address);

                const startDate = document.createElement("p");
                startDate.textContent = event.StartDate.substring(0, 10);
                listItem.appendChild(startDate);


                const endDate = document.createElement("p");
                endDate.textContent = event.EndDate.substring(0, 10);
                listItem.appendChild(endDate);

                const reservedTickets = document.createElement("p");
                if (event.reservedTickets != undefined) {
                    reservedTickets.textContent = event.reservedTickets;

                    listItem.appendChild(reservedTickets);
                }

                const maxTickets = document.createElement("p");
                maxTickets.textContent = event.MaxTickets;
                listItem.appendChild(maxTickets);

                const reserveBtn = document.createElement("input");
                reserveBtn.type = "Button";

                if (event.isReserved) {
                    reserveBtn.value = "Cancel";
                    reserveBtn.addEventListener('click', (e) => {
                        cancelListener(event.id);
                    });
                } else {
                    reserveBtn.value = "Reserve";
                    reserveBtn.addEventListener('click', (e) => {
                        reserveListener(event.id);
                    });
                }

                listItem.appendChild(reserveBtn);

                eventList.appendChild(listItem);

            });
        }
    }
    xhrEventList.send();
}

async function reserveListener(eventId) {
    const responseCode = await verifyUser("/api/verify")
    if (responseCode === 200 || responseCode === 202) {
        const reserveRequest = new XMLHttpRequest();
        reserveRequest.open("POST", "/api/reserveEvent", true);
        reserveRequest.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                createEventList();
            }
        }
        const data = new FormData();
        data.append("EventId", eventId);
        reserveRequest.send(data);
    }
}

async function cancelListener(eventId) {
    const responseCode = await verifyUser("/api/verify")
    if (responseCode === 200 || responseCode === 202) {
        const reserveRequest = new XMLHttpRequest();
        reserveRequest.open("POST", "/api/cancelEvent", true);
        reserveRequest.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                createEventList();
            }
        }
        const data = new FormData();
        data.append("EventId", eventId);
        reserveRequest.send(data);
    }
}