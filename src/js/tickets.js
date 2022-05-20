const eventList = document.querySelector("#id_events_list");
const xhrEventList = new XMLHttpRequest();
xhrEventList.open("GET", "/getEvents", true);
xhrEventList.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const myArr = JSON.parse(this.responseText);
        myArr.forEach((event) => {
            console.log(event);
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
            startDate.textContent = event.StartDate;
            listItem.appendChild(startDate);


            const endDate = document.createElement("p");
            endDate.textContent = event.EndDate;
            listItem.appendChild(endDate);

            const reservedTickets = document.createElement("p");
            if (event.reservedTickets != undefined) {
                reservedTickets.textContent = event.reservedTickets;
                
                listItem.appendChild(reservedTickets);
            }

            const maxTickets = document.createElement("p");
            maxTickets.textContent = event.MaxTickets;
            listItem.appendChild(maxTickets);

            const removeBtn = document.createElement("input");
            removeBtn.value = "delete"
            removeBtn.type = "Button"
            listItem.appendChild(removeBtn);

            eventList.appendChild(listItem);
            
        });
    }
}
xhrEventList.send();