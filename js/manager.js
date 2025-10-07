const scheduleTableBody = document.querySelector("#scheduleTable tbody");
const hallButtons = document.querySelectorAll(".btn-toggle[data-hall]"); // Theater 1 & Theater 2 filter buttons

let allScreenings = [];
let currentTheatreId = 1;

// API calls
const fetchScreenings = () => fetch("http://localhost:8080/api/screenings").then(r => r.json());
const fetchSeats = (id) => fetch(`http://localhost:8080/api/screenings/${id}/available-seats`).then(r => r.json()).catch(() => null);
const deleteScreening = (id) => fetch(`http://localhost:8080/api/screenings/delete/${id}`, {method: 'DELETE'});
const createScreening = (screening) => fetch("http://localhost:8080/api/screenings", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(screening)
});

async function loadScreenings() {
    showMessage("Loading screenings...");
    
    try {
        allScreenings = await fetchScreenings();
        allScreenings.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        
        // OLD WAY (Sequential - SLOW): 10 screenings × 200ms = 2+ seconds
        /*
        for (const screening of allScreenings) {
            const seats = await fetchSeats(screening.showId);  // Waits for each one
            const capacity = screening.theatre.numRows * screening.theatre.seatsPerRow;
            screening.ticketInfo = seats ? `${capacity - seats.length}/${capacity}` : `?/${capacity}`;
        }
        */
        
        // NEW WAY (Parallel - FAST): All at once = ~200ms total
        const seatPromises = allScreenings.map(async screening => {
            const capacity = screening.theatre.numRows * screening.theatre.seatsPerRow;
            const seats = await fetchSeats(screening.showId);
            screening.ticketInfo = seats ? `${capacity - seats.length}/${capacity}` : `?/${capacity}`;
            return screening;
        });
        
        await Promise.all(seatPromises);
        displayScreenings();
    } catch (error) {
        showMessage("Error loading screenings");
    }
}

function displayScreenings() {
    const filtered = allScreenings.filter(s => s.theatre.theatreId == currentTheatreId);
    scheduleTableBody.innerHTML = '';
    
    filtered.forEach(screening => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${new Date(screening.startTime).toLocaleDateString('da-DK')}</td>
            <td>${new Date(screening.startTime).toLocaleTimeString('da-DK', {hour:'2-digit', minute:'2-digit'})}</td>
            <td>${screening.movie.title}</td>
            <td class="col-actions">
                <button class="btn btn-outline">Change</button>
                <span class="cancel-screening-link">Cancel screening</span>
            </td>
            <td class="ticket-count"><strong>${screening.ticketInfo}</strong></td>
        `;
        
        row.querySelector('.cancel-screening-link').addEventListener('click', () => cancelScreening(screening.showId));
        scheduleTableBody.appendChild(row);
    });
}

function showMessage(msg) {
    scheduleTableBody.innerHTML = `<tr><td colspan="5" class="table-message">${msg}</td></tr>`;
}

async function cancelScreening(id) {
    if (!confirm('Cancel this screening?')) return;
    
    const response = await deleteScreening(id);
    if (response.ok) {
        allScreenings = allScreenings.filter(s => s.showId !== id);
        displayScreenings();
        alert('Cancelled');
    } else {
        alert('Failed');
    }
}

async function addNewScreening() {
    const movieId = prompt("Movie ID:");
    const theatreId = prompt("Theatre ID (1 or 2):");
    const startTime = prompt("Start time (YYYY-MM-DDTHH:MM:SS):");
    const operatorId = prompt("Operator ID:");
    
    if (!movieId || !theatreId || !startTime || !operatorId) {
        alert("All fields required");
        return;
    }
    
    const screening = {
        movie: { movieId: parseInt(movieId) },
        theatre: { theatreId: parseInt(theatreId) },
        startTime: startTime,
        operator: { employeeId: parseInt(operatorId) },
        status: "SCHEDULED"
    };
    
    const response = await createScreening(screening);
    if (response.ok) {
        alert('Screening added');
        loadScreenings();
    } else {
        alert('Failed to add');
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", loadScreenings);
document.getElementById('addScreeningBtn').addEventListener('click', addNewScreening);
hallButtons.forEach(btn => btn.addEventListener("click", (e) => {
    hallButtons.forEach(b => b.setAttribute("aria-pressed", "false"));
    e.target.setAttribute("aria-pressed", "true");
    currentTheatreId = e.target.dataset.hall === 'hall1' ? 1 : 2;
    displayScreenings();
}));