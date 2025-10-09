let allScreenings = [];
let allMovies = [];
let allGenres = [];
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

// ================= SCREENINGS =================

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

// ================= MOVIES =================

async function loadMovies() {
    showMessage("Loading movies...");
    try {
        allMovies = await api("movies");
        populateMovieTable();
    } catch {
        showMessage("Error loading movies");
    }
}

async function deleteMovie(id) {
    if (!confirm('Delete this movie?')) return;

    const res = await fetch(`http://localhost:8080/api/movies/delete/${id}`, { method: 'DELETE' });
    const text = await res.text();
    if (res.ok) {
        allMovies = allMovies.filter(m => m.movieId !== id);
        await populateMovieTable();
        alert('Movie deleted');
    } else alert('Failed to delete: ' + text);
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

// ================= GENRES (Searchable Dropdown) =================

async function loadGenres() {
    try {
        allGenres = await api("movies/genres");
    } catch (err) {
        console.error("Error loading genres:", err);
        allGenres = [];
    }
}

function setupGenreSearch() {
    const input = document.getElementById("genreSearch");
    const list = document.getElementById("genreList");

    const renderList = (filtered) => {
        list.innerHTML = "";
        if (filtered.length === 0 && input.value.trim() !== "") {
            const li = document.createElement("li");
            li.textContent = `➕ Add "${input.value}" as new genre`;
            li.onclick = () => {
                input.value = input.value.trim();
                list.classList.add("hidden");
                input.dataset.genreValue = "new:" + input.value;
            };
            list.appendChild(li);
        } else {
            filtered.forEach(g => {
                const li = document.createElement("li");
                li.textContent = g.genreName || g.name;
                li.onclick = () => {
                    input.value = g.genreName || g.name;
                    input.dataset.genreValue = g.genreId;
                    list.classList.add("hidden");
                };
                list.appendChild(li);
            });
        }
        list.classList.remove("hidden");
    };

    input.addEventListener("keyup", () => {
        const query = input.value.toLowerCase();
        const filtered = allGenres.filter(g =>
            (g.genreName || g.name).toLowerCase().includes(query)
        );
        renderList(filtered);
    });

    input.addEventListener("focus", () => {
        renderList(allGenres);
    });

    input.addEventListener("blur", () => {
        setTimeout(() => list.classList.add("hidden"), 200);
    });
}

// ================= ADD MOVIE FORM =================

function setupMovieFormHandler() {
    const modal = document.getElementById('addMovieModal');
    const form = document.getElementById('addScreeningMovieForm');
    const genreInput = document.getElementById('genreSearch');

    form.onsubmit = async (e) => {
        e.preventDefault();

        const movieTitle = form.movieTitle.value.trim();
        const ageLimit = parseInt(form.ageLimit.value);
        const duration = parseInt(form.duration.value);
        const description = form.description.value.trim();
        const genreValue = genreInput.dataset.genreValue || "new:" + genreInput.value.trim();

        let genrePayload;
        if (genreValue.startsWith("new:")) {
            genrePayload = { genreName: genreValue.replace("new:", "") };
        } else {
            genrePayload = { genreId: parseInt(genreValue) };
        }

        const payload = {
            title: movieTitle,
            ageLimit,
            duration,
            description,
            genre: genrePayload
        };

        try {
            const res = await fetch("http://localhost:8080/api/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Movie added!");
                modal.classList.add('hidden');
                form.reset();
                genreInput.dataset.genreValue = "";
                loadMovies();
            } else {
                const errText = await res.text();
                alert("Failed to add movie: " + errText);
            }
        } catch (err) {
            alert("Error creating movie: " + err.message);
        }
    };
}

// ================= DROPDOWNS =================

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

// ================= MODAL CONTROLS =================

function setupModalControls() {
    const modalScreening = document.getElementById('addScreeningModal');
    const modalMovie = document.getElementById('addMovieModal');
    const addScreeningBtn = document.querySelector('.panel-actions #addScreeningBtn');
    const addMovieBtn = document.getElementById('addMovieBtn');

    // Screening modal
    addScreeningBtn.onclick = () => modalScreening.classList.remove('hidden');
    document.getElementById('closeModalBtn').onclick = () => modalScreening.classList.add('hidden');

    // Movie modal
    addMovieBtn.onclick = async () => {
        modalMovie.classList.remove('hidden');
        await loadGenres();
        setupGenreSearch();
    };
    document.getElementById('closeMovieModalBtn').onclick = () => modalMovie.classList.add('hidden');

    // Close on background click
    window.onclick = e => {
        if (e.target === modalScreening) modalScreening.classList.add('hidden');
        if (e.target === modalMovie) modalMovie.classList.add('hidden');
    };
}

// ================= THEATRE BUTTONS =================

function setupHallButtons() {
    const hallBtns = document.querySelectorAll(".btn-toggle[data-hall]");
    hallBtns.forEach(btn => btn.onclick = e => {
        hallBtns.forEach(b => b.setAttribute("aria-pressed", "false"));
        e.target.setAttribute("aria-pressed", "true");
        currentTheatreId = e.target.dataset.hall === 'hall1' ? 1 : 2;
        displayScreenings();
    });
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    setupModalControls();
    setupFormHandler();
    setupMovieFormHandler();
    setupHallButtons();
    loadScreenings();
    loadMovies();
});
