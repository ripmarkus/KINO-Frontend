let allScreenings = [];
let allMovies = [];
let currentTheatreId = 1;


const api = (url, options = {}) =>
    fetch(`http://localhost:8080/api/${url}`, options).then(r =>
        r.ok ? r.json() : Promise.reject("API error"));

const formatStartTime = (date, time) => {
    const [d, m, y] = date.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${time}:00`;
};

const showMessage = msg =>
    document.querySelector("#scheduleTable tbody").innerHTML =
        `<tr><td colspan="5" class="table-message">${msg}</td></tr>`;

async function loadScreenings() {
    showMessage("Loading screenings...");

    try {
        allScreenings = await api("screenings");
        allScreenings.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        populateDropdowns();

        await Promise.all(allScreenings.map(async s => {
            const cap = s.theatre.numRows * s.theatre.seatsPerRow;
            const seats = await api(`screenings/${s.showId}/available-seats`).catch(() => null);
            s.ticketInfo = seats ? `${cap - seats.length}/${cap}` : `?/${cap}`;
        }));

        displayScreenings();
    } catch {
        showMessage("Error loading screenings");
    }
}

async function loadMovies() {
    showMessage("Loading movies...");
    try {
        allMovies = await api("movies");
        populateMovieTable();
    } catch {
        showMessage("Error loading movies");
    }
}

function displayScreenings() {
    const tbody = document.querySelector("#scheduleTable tbody");
    tbody.innerHTML = '';

    allScreenings
        .filter(s => s.theatre.theatreId == currentTheatreId)
        .forEach(s => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${new Date(s.startTime).toLocaleDateString('da-DK')}</td>
                <td>${new Date(s.startTime).toLocaleTimeString('da-DK', {hour:'2-digit', minute:'2-digit'})}</td>
                <td>${s.movie.title}</td>
                <td class="ticket-count"><strong>${s.ticketInfo}</strong></td>
                <td class="col-actions">
                    <button class="btn btn-outline">Change</button>
                    <span class="cancel-screening-link">Cancel</span>
                </td>
            `;
            row.querySelector('.cancel-screening-link').onclick = () => cancelScreening(s.showId);
            tbody.appendChild(row);
        });
}

async function cancelScreening(id) {
    if (!confirm('Cancel this screening?')) return;

    const res = await fetch(`http://localhost:8080/api/screenings/delete/${id}`, { method: 'DELETE' });
    if (res.ok) {
        allScreenings = allScreenings.filter(s => s.showId !== id);
        displayScreenings();
        alert('Cancelled');
    } else alert('Failed');
}

async function deleteMovie(id) {
    if (!confirm('Delete this movie?')) return;

    const res = await fetch(`http://localhost:8080/api/movies/delete/${id}`, { method: 'DELETE' });
    console.log("DELETE status:", res.status);
    const text = await res.text();
    console.log("Response body:", text);
    if (res.ok) {
        allMovies = allMovies.filter(m => m.movieId !== id);
        await populateMovieTable();
        alert('Movie deleted');
    } else alert('Failed');
}

async function populateMovieTable() {
    try {
        const tbody = document.getElementById("movieList");
        tbody.innerHTML = "";

        allMovies.forEach(movie => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${movie.title}</td>
                <td>${movie.ageLimit || "–"}</td>
                <td>${movie.duration} min</td>
                <td>${movie.genre?.genreName || "–"}</td>
                <td class="col-description">${movie.description || "–"}</td>
                <td class="col-actions">
                    <button class="btn btn-outline">Edit</button>
                    <span class="cancel-movie-link">Delete</span>
                </td>
            `;
            row.querySelector('.cancel-movie-link').onclick = () => deleteMovie(movie.movieId);
            tbody.appendChild(row);
        });
    } catch {
        document.getElementById("movieList").innerHTML = `
            <tr><td colspan="6">Failed to load movies</td></tr>
        `;
    }
}

async function populateDropdowns() {
    const [movies] = await Promise.all([api("movies")]);

    const setOptions = (selectId, items, idKey, textKey) => {
        const select = document.getElementById(selectId);
        if (!select) return;
        select.innerHTML = "<option value=''>Select</option>";
        items.forEach(item => {
            const opt = new Option(item[textKey], item[idKey]);
            select.appendChild(opt);
        });
    };

    const theatres = Array.from(new Map(allScreenings.map(s => [s.theatre.theatreId, s.theatre])).values());
    const operators = Array.from(new Map(allScreenings.map(s => [s.operator.employeeId, s.operator])).values());

    setOptions("movieSelect", movies, "movieId", "title");
    setOptions("theatreSelect", theatres, "theatreId", "name");
    setOptions("operatorSelect", operators, "employeeId", "name");
}

function setupModalControls() {
    const modalScreening = document.getElementById('addScreeningModal');
    const modalMovie = document.getElementById('addMovieModal');
    document.getElementById('addScreeningBtn').onclick = () => modalScreening.classList.remove('hidden');
    document.getElementById('closeModalBtn').onclick = () => modalScreening.classList.add('hidden');
    document.getElementById('addScreeningBtn').onclick = () => modalMovie.classList.remove('hidden');
    document.getElementById('closeModalBtn').onclick = () => modalMovie.classList.add('hidden');
    window.onclick = e => { if (e.target === modalScreening) modalScreening.classList.add('hidden'); };
    window.onclick = e => { if (e.target === modalScreening) modalScreening.classList.add('hidden'); };
}


function setupFormHandler() {
    const modal = document.getElementById('addScreeningModal');
    const form = document.getElementById('addScreeningForm');

    form.onsubmit = async (e) => {
        e.preventDefault();

        const movieId = form.movieSelect.value;
        const theatreId = form.theatreSelect.value;
        const date = form.dateInput.value;
        const time = form.timeInput.value;
        const operatorId = form.operatorSelect.value;

        const payload = {
            movieId: parseInt(movieId),
            theatreId: parseInt(theatreId),
            employeeId: parseInt(operatorId),
            startTime: formatStartTime(date, time)
        };

        try {
            const res = await fetch("http://localhost:8080/api/screenings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Screening added!");
                modal.classList.add('hidden');
                form.reset();
                loadScreenings();
            } else alert("Failed to add screening.");
        } catch (err) {
            alert("Error creating screening: " + err.message);
        }
    };
}

function setupMovieFormHandler() {
    const modalScreening = document.getElementById('addScreeningModal');
    const form = document.getElementById('addScreeningMovieForm');

    form.onsubmit = async (e) => {
        e.preventDefault();

        const movieTitle = form.movieTitle.value;
        const ageLimit = form.ageLimit.value;
        const duration = form.duration.value;
        const genre = form.genre.value;
        const description = form.description.value;

        const payload = {
            title: movieTitle,
            ageLimit: ageLimit,
            duration: duration,
            genre: genre,
            description: description
        };

        try {
            const res = await fetch("http://localhost:8080/api/screenings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Screening added!");
                modal.classList.add('hidden');
                form.reset();
                loadScreenings();
            } else alert("Failed to add screening.");
        } catch (err) {
            alert("Error creating screening: " + err.message);
        }
    };
}

function setupHallButtons() {
    const hallBtns = document.querySelectorAll(".btn-toggle[data-hall]");

    hallBtns.forEach(btn => btn.onclick = e => {
        hallBtns.forEach(b => b.setAttribute("aria-pressed", "false"));
        e.target.setAttribute("aria-pressed", "true");
        currentTheatreId = e.target.dataset.hall === 'hall1' ? 1 : 2;
        displayScreenings();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupModalControls();
    setupFormHandler();
    setupHallButtons();
    loadScreenings();
    loadMovies();
    populateMovieTable();
});
