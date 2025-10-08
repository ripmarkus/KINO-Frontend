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
        
        // Populate theatres and operators from screening data
        populateTheatresFromScreenings();
        populateOperatorsFromScreenings();
        
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
    const scheduleTableBody = document.querySelector("#scheduleTable tbody");
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
    const scheduleTableBody = document.querySelector("#scheduleTable tbody");
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

async function populateMovies() {
    console.log("populateMovies called");
    try {
        const response = await fetch("http://localhost:8080/api/movies");
        console.log("Movies response status:", response.status);
        const movies = await response.json();
        console.log("Movies data:", movies);

        const movieSelect = document.getElementById("movieSelect");
        console.log("movieSelect element:", movieSelect);
        if (!movieSelect) {
            console.error("movieSelect element not found");
            return;
        }
        
        movieSelect.innerHTML = "<option value=''>Select a movie</option>";

        movies.forEach(movie => {
            const option = document.createElement("option");
            option.value = movie.movieId;
            option.textContent = movie.title;
            movieSelect.appendChild(option);
        });
        console.log("Movies populated successfully, total:", movies.length);
    } catch (error) {
        console.error("Error loading movies:", error);
    }
}

// Populate theatres from existing screenings data
function populateTheatresFromScreenings() {
    const uniqueTheatres = [];
    const theatreIds = new Set();
    
    allScreenings.forEach(screening => {
        if (!theatreIds.has(screening.theatre.theatreId)) {
            theatreIds.add(screening.theatre.theatreId);
            uniqueTheatres.push(screening.theatre);
        }
    });

    const theatreSelect = document.getElementById("theatreSelect");
    theatreSelect.innerHTML = "<option value=''>Select a theatre</option>";

    uniqueTheatres.forEach(theatre => {
        const option = document.createElement("option");
        option.value = theatre.theatreId;
        option.textContent = theatre.name;
        theatreSelect.appendChild(option);
    });
}

// Populate operators from existing screenings data
function populateOperatorsFromScreenings() {
    const uniqueOperators = [];
    const operatorIds = new Set();
    
    allScreenings.forEach(screening => {
        if (!operatorIds.has(screening.operator.employeeId)) {
            operatorIds.add(screening.operator.employeeId);
            uniqueOperators.push(screening.operator);
        }
    });

    const operatorSelect = document.getElementById("operatorSelect");
    operatorSelect.innerHTML = "<option value=''>Select an operator</option>";

    uniqueOperators.forEach(operator => {
        const option = document.createElement("option");
        option.value = operator.employeeId;
        option.textContent = operator.name;
        operatorSelect.appendChild(option);
    });
}

// Fetch and populate theatre dropdown
async function populateTheatres() {
    const response = await fetch("http://localhost:8080/api/theatres");
    const theatres = await response.json();

    const theatreSelect = document.getElementById("theatreSelect");
    theatreSelect.innerHTML = "<option value=''>Select a theatre</option>";

    theatres.forEach(theatre => {
        const option = document.createElement("option");
        option.value = theatre.theatreId;
        option.textContent = theatre.name;
        theatreSelect.appendChild(option);
    });
}


// Modal controls and event listeners
document.addEventListener("DOMContentLoaded", async () => {
    const modal = document.getElementById('addScreeningModal');
    const addScreeningBtn = document.getElementById('addScreeningBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addScreeningForm = document.getElementById('addScreeningForm');
    const hallButtons = document.querySelectorAll(".btn-toggle[data-hall]");

    addScreeningBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    addScreeningForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const movieId = document.getElementById("movieSelect").value;
        const theatreId = document.getElementById("theatreSelect").value;
        const startTime = document.getElementById("startTimeInput").value;
        const operatorId = document.getElementById("operatorSelect").value;

        console.log("Form values:", { movieId, theatreId, startTime, operatorId });

        // Format datetime to match API expected format
        const formattedStartTime = startTime.includes('T') ? startTime + ':00' : startTime;

        // Fetch full objects for movie, theatre, and operator
        try {
            const [movieResponse, operatorData] = await Promise.all([
                fetch(`http://localhost:8080/api/movies/${movieId}`),
                // Get operator from screenings since there's no employee endpoint
                new Promise(resolve => {
                    const operator = allScreenings.find(s => s.operator.employeeId == operatorId)?.operator;
                    resolve(operator);
                })
            ]);

            const movie = await movieResponse.json();
            const theatre = allScreenings.find(s => s.theatre.theatreId == theatreId)?.theatre;

            if (!movie || !theatre || !operatorData) {
                alert("Error: Could not fetch required data");
                return;
            }

            const screening = {
                movie: movie,
                theatre: theatre,
                startTime: formattedStartTime,
                operator: operatorData,
                status: "SCHEDULED"
            };

            console.log("Screening object:", screening);

            const response = await fetch("http://localhost:8080/api/screenings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(screening)
            });

            console.log("Response status:", response.status);
            const responseText = await response.text();
            console.log("Response body:", responseText);

            if (response.ok) {
                alert("Screening added successfully!");
                modal.classList.add('hidden');
                addScreeningForm.reset();
                loadScreenings();
            } else {
                alert("Failed to add screening. Check console for details.");
            }
        } catch (error) {
            console.error("Error creating screening:", error);
            alert("Error creating screening: " + error.message);
        }
    });
    
    hallButtons.forEach(btn => btn.addEventListener("click", (e) => {
        hallButtons.forEach(b => b.setAttribute("aria-pressed", "false"));
        e.target.setAttribute("aria-pressed", "true");
        currentTheatreId = e.target.dataset.hall === 'hall1' ? 1 : 2;
        displayScreenings();
    }));
    
    // Load initial data
    await populateMovies();
    loadScreenings();
});