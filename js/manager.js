const scheduleTableBody = document.querySelector("#scheduleTable tbody");
const hallButtons = document.querySelectorAll(".btn-toggle[data-hall]");

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

let activeHall = "hall1";

function renderSchedule(hall) {
    scheduleTableBody.innerHTML = "";
    schedules[hall].forEach((show, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${show.start}</td>
      <td>${show.end}</td>
      <td>${show.title}</td>
      <td class="col-actions">
        <button class="btn btn-outline">Change</button>
        <button class="btn btn-outline">Cancel</button>
      </td>
      <td>
        <button class="btn btn-primary" data-sales="${hall}:${index}">See sales</button>
      </td>
    `;
        scheduleTableBody.appendChild(row);
    });

    scheduleTableBody.querySelectorAll("[data-sales]").forEach(btn => {
        btn.addEventListener("click", () => {
            const [h, i] = btn.getAttribute("data-sales").split(":");
            showSales(h, Number(i));
        });
    });
}

function showSales(hall, index) {
    const show = schedules[hall][index];
    const popup = window.open("", "Ticket sales", "width=420,height=320");
    popup.document.write(`
      <h2 style="font-family: Montserrat, sans-serif;">${show.title} - Sales data</h2>
      <p><strong>Tickets sold:</strong> ${show.tickets}</p>
      <p><strong>Concession:</strong> ${show.concession}</p>
      <button onclick="window.close()">Close</button>
  `);
}

renderSchedule(activeHall);

hallButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        hallButtons.forEach(b => b.setAttribute("aria-pressed","false"));
        btn.setAttribute("aria-pressed","true");
        activeHall = btn.dataset.hall;
        renderSchedule(activeHall);
    });
});
