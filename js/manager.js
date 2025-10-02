const scheduleTableBody = document.querySelector("#scheduleTable tbody");
const hallButtons = document.querySelectorAll(".hall-btn");

// Mockup data for 2 theaters
const schedules = {
    hall1: [
        { start: "14:00", end: "16:28", title: "Inception", tickets: 120, concession: "45 sodas, 30 popcorn" },
        { start: "17:00", end: "20:15", title: "Titanic", tickets: 80, concession: "20 sodas, 15 popcorn" }
    ],
    hall2: [
        { start: "13:00", end: "15:45", title: "Avatar", tickets: 100, concession: "30 sodas, 20 popcorn" },
        { start: "16:00", end: "18:30", title: "The Dark Knight", tickets: 90, concession: "25 sodas, 18 popcorn" }
    ]
};

// Hold styr på den aktive hall
let activeHall = "hall1";

// Funktion til at render schedule
function renderSchedule(hall) {
    scheduleTableBody.innerHTML = "";
    schedules[hall].forEach((show, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${show.start}</td>
            <td>${show.end}</td>
            <td>${show.title}</td>
            <td>
                <button class="action-btn">Change</button>
                <button class="cancel-btn">Cancel</button>
            </td>
            <td>
                <button class="action-btn" onclick="showSales('${hall}', ${index})">See sales</button>
            </td>
        `;
        scheduleTableBody.appendChild(row);
    });
}

// Funktion til at vise billetsalg og concession i et popup-vindue
function showSales(hall, index) {
    const show = schedules[hall][index];
    const popup = window.open("", "Ticket sales", "width=400,height=300");
    popup.document.write(`
        <h2>${show.title} - Sales data</h2>
        <p><strong>Tickets sold:</strong> ${show.tickets}</p>
        <p><strong>Concession:</strong> ${show.concession}</p>
        <button onclick="window.close()">Close</button>
    `);
}

// Initial render
renderSchedule(activeHall);

// Event listeners på knapper
hallButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Fjern active fra alle
        hallButtons.forEach(b => b.classList.remove("active"));
        // Marker den valgte
        btn.classList.add("active");
        activeHall = btn.dataset.hall;
        renderSchedule(activeHall);
    });
});
