const API = "http://localhost:3000";

async function load(table) {
    try {
        const res = await fetch(`${API}/${table}`);
        const data = await res.json();
        render(data, table);
    } catch (err) {
        console.log(err);
    }
}

function render(data, table) {
    const output = document.getElementById("output");
    output.innerHTML = `<h2>${table.toUpperCase()}</h2>`;

    data.forEach(item => {
        const id = getId(item);

        const div = document.createElement("div");
        div.classList.add("card");

        let html = `<div class="card-body">`;

        for (let key in item) {
            html += `
                <div class="row">
                    <strong>${key}:</strong> <span>${item[key]}</span>
                </div>
            `;
        }

        html += `
            <div class="actions">
                <button onclick="editItem('${table}', ${id})">Edit</button>
                <button onclick="deleteItem('${table}', ${id})">Delete</button>
            </div>
        </div>`;

        div.innerHTML = html;
        output.appendChild(div);
    });
}

function getId(item) {
    return item.patient_id ||
           item.doctor_id ||
           item.department_id ||
           item.id ||
           item.appointment_id ||
           item.record_id ||
           item.prescription_id ||
           item.bill_id;
}

async function addPatient() {
    const full_name = document.getElementById("name").value;
    const gender = document.getElementById("gender").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    await fetch(`${API}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            full_name,
            gender,
            phone,
            address
        })
    });

    load("patients");
}

async function deleteItem(table, id) {
    await fetch(`${API}/${table}/${id}`, {
        method: "DELETE"
    });

    load(table);
}

async function editItem(table, id) {
    if (!json) return;

    try {
        const parsed = JSON.parse(json);

        await fetch(`${API}/${table}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed)
        });

        load(table);
    } catch (err) {
        alert("Invalid JSON");
    }
}