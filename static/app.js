async function loadData() {
	const response = await fetch("/api/data");
	return response.json();
}

async function saveData(data) {
	await fetch("/api/data", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(data)
	});
}
const data = loadData();
function updateResouces(data){
    // get section
    const resourcesSection = document.getElementById("resources");
    // clear
    resourcesSection.innerHTML = "<h2>Resources</h2>";

    const resources = data.resources;
    for (const [key, value] of Object.entries(resources)) {
        console.log(key, value);
        // details
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        const buttonContainer = document.createElement("div");
        summary.textContent = key;
        // remove button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Delete";
        removeButton.addEventListener("click", async (event) => {
            removeButton.textContent = "Are you sure?";
            // add class to change color to red
            removeButton.classList.add("remove-button-confirm");
            // we set timeout to prevent lag-double click from removing the resource immediately
            setTimeout(() => {
                async function removeResource(event) {
                    delete data.resources[key];
                    await saveData(data);
                    updateResouces(data);
                }
                removeButton.addEventListener("click", removeResource, { once: true });
                removeButton.addEventListener("blur", (event) => {
                    removeButton.textContent = "Delete";
                    removeButton.style.backgroundColor = "";
                    // remove the event listener for removing the resource
                    removeButton.removeEventListener("click", removeResource);
                    removeButton.classList.remove("remove-button-confirm");
                    // not doing this means click off > click back on > remove resource instantly == bad
                }, { once: true });
            }, 0.2)
        });
        buttonContainer.appendChild(removeButton);

        // edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", async (event) => {
            // stop propagation to prevent the details from closing when clicking the edit button
            event.stopPropagation();
            // change the table tds to be contenteditable
            const tds = details.querySelectorAll("td");
            for (const td of tds) {
                td.contentEditable = true;
            }
            // change the edit button to a save button
            editButton.textContent = "Save";
            editButton.addEventListener("click", async (event) => {
                event.stopPropagation();
                const headers = details.querySelectorAll("thead th");
                const tds = details.querySelectorAll("tbody td");
                const newValues = {};
                for (let i = 0; i < tds.length; i++) {
                    const header = headers[i].textContent.trim();
                    const value = tds[i].textContent.trim();
                    newValues[header] = value;
                    tds[i].contentEditable = "false";
                }
                data.resources[key] = newValues;
                await saveData(data);
                updateResouces(data);
            }, { once: true });
        });
        buttonContainer.appendChild(editButton);
        summary.appendChild(buttonContainer);
        details.appendChild(summary);

        // table 
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");

        // table header
        const headerRow = document.createElement("tr");
        let headers = ["stock", "price", "needed", "incoming", "spent"];
        for (const header of headers) {
            const th = document.createElement("th");
            th.textContent = header;
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);

        // table body
        const bodyRow = document.createElement("tr");
        for (const header of headers) {
            const td = document.createElement("td");
            td.textContent = value[header];
            bodyRow.appendChild(td);
        }
        tbody.appendChild(bodyRow);
        
        table.appendChild(thead);
        table.appendChild(tbody);
        details.appendChild(table);
        resourcesSection.appendChild(details);
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    const data = await loadData();
    console.log(data);
    updateResouces(data);
});