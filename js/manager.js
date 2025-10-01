const scheduleTableBody = document.querySelector("#scheduleTable tbody");
const hallSelect = document.getElementById("hallSelect");

// Mockup data for 2 sale
const schedules = {
    sal1: [
        { start: "14:00", end: "16:28", title: "Inception", tickets: 120, concession: "45 sodavand, 30 popcorn" },
        { start: "17:00", end: "20:15", title: "Titanic", tickets: 80, concession: "20 sodavand, 15 popcorn" }
    ],
    sal2: [
        { start: "13:00", end: "15:45", title: "Avatar", tickets: 100, concession: "30 sodavand, 20 popcorn" },
        { start: "16:00", end: "18:30", title: "The Dark Knight", tickets: 90, concession: "25 sodavand, 18 popcorn" }
    ]
};

// Funktion til at render tidsplan
function renderSchedule(sal) {
    scheduleTableBody.innerHTML = "";
    schedules[sal].forEach((show, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${show.start}</td>
      <td>${show.end}</td>
      <td>${show.title}</td>
      <td>
        <button class="action-btn">Ændr</button>
        <button class="action-btn">Annuller</button>
      </td>
      <td>
        <button class="action-btn" onclick="showSales('${sal}', ${index})">Se salg</button>
      </td>
    `;
        scheduleTableBody.appendChild(row);
    });
}

// Funktion til at vise billetsalg og concession i et nyt vindue
function showSales(sal, index) {
    const show = schedules[sal][index];
    const popup = window.open("", "Billetsalg", "width=400,height=300");
    popup.document.write(`
    <h2>${show.title} - Salgsdata</h2>
    <p><strong>Billetter solgt:</strong> ${show.tickets}</p>
    <p><strong>Concession:</strong> ${show.concession}</p>
    <button onclick="window.close()">Luk</button>
  `);
}

// Initial render
renderSchedule(hallSelect.value);

// Skift sal dynamisk
hallSelect.addEventListener("change", () => {
    renderSchedule(hallSelect.value);
});
