// Element refs
const filmsLoader = document.getElementById('filmsLoader');
const filmContainer = document.getElementById('filmContainer');
const panelShowtimes = document.getElementById('panelShowtimes');
const timesWrap = document.getElementById('timesWrap');
const timesLoader = document.getElementById('timesLoader');
const showtimeInfo = document.getElementById('showtimeInfo');

const panelSeats = document.getElementById('panelSeats');
const seatMap = document.getElementById('seatMap');
const seatsLoader = document.getElementById('seatsLoader');
const screenNote = document.getElementById('screenNote');

const selFilm = document.getElementById('selFilm');
const selTime = document.getElementById('selTime');
const selSeats = document.getElementById('selSeats');
const summaryCount = document.getElementById('summaryCount');
const priceInfo = document.getElementById('priceInfo');

const confirmBtn = document.getElementById('confirmBtn');
const formStatus = document.getElementById('formStatus');

const reservationForm = document.getElementById('reservationForm');

let screenings = [];         // raw screenings from /api/scheduling/week
let uniqueMovies = [];       // dedup movies
let selectedMovie = null;
let movieScreenings = [];    // screenings for selected movie
let selectedScreening = null;
let availableSeats = [];     // seats returned from /available-seats (list of seat objects)
let screeningDetail = null;  // result from GET /api/screenings/{id}
let selectedSeatIds = new Set();
let seatPricePer = null;

// Refs til reservation
const nameEl = document.getElementById('name');
const emailEl = document.getElementById('email');
const phoneEl = document.getElementById('phone');
const customerStatus = document.getElementById('customerStatus');
const clearCustomerBtn = document.getElementById('clearCustomerBtn');

const API_BASE = `${window.location.origin}/api`;

let existingCustomer = null;

document.addEventListener('DOMContentLoaded', init);
document.getElementById('help').addEventListener('click', ()=> alert('Vælg film → tidspunkt → sæder → kontaktinfo → bekræft.'));
document.getElementById('restart').addEventListener('click', resetAll);
reservationForm.addEventListener('submit', handleSubmit);

phoneEl.addEventListener('blur', () => lookupCustomerByPhone(phoneEl.value));

clearCustomerBtn?.addEventListener('click', () => {
    setNewCustomerUI();
    nameEl.value = '';
    emailEl.value = '';
});

async function init(){
    filmsLoader.innerHTML = '<span class="loader"></span> Henter uges screenings...';
    try {
        const res = await fetch(`${API_BASE}/scheduling/week`);
        if (!res.ok) throw new Error('Kunne ikke hente uge-plan');
        screenings = await res.json();
        buildMovieList(screenings);
    } catch (err) {
        filmContainer.innerHTML = '<div class="muted-small">Fejl ved hentning af screenings.</div>';
        console.error(err);
    } finally {
        filmsLoader.innerHTML = '';
    }
}

// Build unique movies from screenings
function buildMovieList(allScreenings){
    // screenings may have screening.movie object
    const map = new Map();
    allScreenings.forEach(s => {
        const m = s.movie || s.getMovie || s.movieObject || null;
        if (m) {
            const key = m.id || m.movieId || m.title;
            if (!map.has(key)) map.set(key, m);
        }
    });
    uniqueMovies = Array.from(map.values());
    if (uniqueMovies.length === 0) {
        // fallback: try grouping by screening.movieTitle or screening.title
        const fallback = {};
        allScreenings.forEach(s => {
            const title = s.movieTitle || s.title || (s.movie && s.movie.title) || 'Ukendt';
            if (!fallback[title]) fallback[title] = { title, poster: s.movie && s.movie.poster };
        });
        uniqueMovies = Object.values(fallback);
    }

    renderMovies(uniqueMovies);
}

// Render film cards
function renderMovies(movies){
    filmContainer.innerHTML = '';
    const tpl = document.getElementById('filmTpl');
    movies.forEach(m => {
        const node = tpl.content.firstElementChild.cloneNode(true);
        const img = node.querySelector('.film-poster');
        img.src = m.poster || m.backdrop || 'placeholder-poster.jpg';
        img.alt = (m.title || 'Ukendt film') + ' plakat';
        node.querySelector('.film-title').textContent = m.title || m.movieTitle || 'Ukendt';
        node.addEventListener('click', ()=> onMovieSelect(m));
        node.addEventListener('keydown', (e)=> { if (e.key === 'Enter') onMovieSelect(m); });
        filmContainer.appendChild(node);
    });
}

// Movie selected -> filter screenings and show times
function onMovieSelect(movie){
    selectedMovie = movie;
    selFilm.textContent = movie.title || movie.movieTitle || 'Ukendt';
    // filter screenings by movie (matching id or title)
    movieScreenings = screenings.filter(s => {
        if (s.movie) {
            return (s.movie.id && movie.id && s.movie.id === movie.id) || (s.movie.title && s.movie.title === movie.title);
        }
        // fallback check
        const title = s.movieTitle || s.title;
        return title && title === (movie.title || movie.movieTitle);
    }).sort((a,b)=> new Date(a.startTime || a.time || a.date).getTime() - new Date(b.startTime || b.time || b.date).getTime());

    renderShowtimes(movieScreenings);
}

function renderShowtimes(list){
    timesWrap.innerHTML = '';
    if (!list || list.length === 0) {
        panelShowtimes.hidden = true;
        showtimeInfo.textContent = 'Ingen forestillinger for denne film i ugen.';
        return;
    }
    panelShowtimes.hidden = false;
    showtimeInfo.textContent = '';

    list.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'btn time-btn btn-toggle';
        const timeStr = s.startTime || s.time || s.dateTime || s.date || s.showTime;
        btn.textContent = formatDate(timeStr);
        btn.title = `Sal: ${s.screen || (s.theatre && s.theatre.name) || '—'} — ID: ${s.id || s.showId || s.screeningId || ''}`;
        btn.addEventListener('click', async () => {
            Array.from(timesWrap.children).forEach(c => c.setAttribute('aria-pressed','false'));
            btn.setAttribute('aria-pressed','true');
            await onShowtimeSelect(s);
        });
        timesWrap.appendChild(btn);
    });
}

// Helper date formatter (dansk kort)
function formatDate(iso){
    const d = new Date(iso);
    if (isNaN(d)) return iso || 'Ukendt tid';
    return d.toLocaleString('da-DK', { weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
}

//Normalisere telefonnumre
function normalizePhone(p){ return (p || '').replace(/[ -]/g, ''); }

function setExistingCustomerUI(customer){
    existingCustomer = customer;
    nameEl.value = customer.name || '';
    emailEl.value = customer.email || '';
    phoneEl.value = customer.phone || phoneEl.value;

    nameEl.readOnly = true;
    emailEl.readOnly = true;

    customerStatus.textContent = `Eksisterende kunde fundet (ID: ${customer.id})`;
    customerStatus.style.color = 'var(--beige)';
    clearCustomerBtn.style.display = 'inline-block';
}

function setNewCustomerUI(){
    existingCustomer = null;
    nameEl.readOnly = false;
    emailEl.readOnly = false;

    customerStatus.textContent = 'Ny kunde – udfyld navn og e-mail';
    customerStatus.style.color = 'rgba(255,255,255,.85)';
    clearCustomerBtn.style.display = 'none';
}

async function lookupCustomerByPhone(phone){
    const q = normalizePhone(phone);
    if (!q){ customerStatus.textContent = ''; return; }

    try {
        const res = await fetch(`${API_BASE}/customers/lookup?phone=${encodeURIComponent(q)}`);
        console.debug('[lookup] status', res.status);

        if (!res.ok) {
            if (res.status === 404) { setNewCustomerUI(); return; }
            throw new Error(`Lookup failed: ${res.status}`);
        }

        const raw = await res.json();
        console.debug('[lookup] body', raw);

        // tolerant mapping of possible field names
        const id    = raw.id ?? raw.customerId ?? raw.customerID ?? raw.customer_id ?? null;
        const name  = raw.name ?? raw.fullName ?? raw.customerName ?? [raw.firstName, raw.lastName].filter(Boolean).join(' ');
        const email = raw.email ?? raw.mail ?? raw.emailAddress ?? '';
        const phoneNorm = raw.phone ?? raw.phoneNumber ?? raw.mobile ?? q;

        if (id) {
            setExistingCustomerUI({ id, name, email, phone: phoneNorm });
        } else {
            console.warn('[lookup] 200 OK but no id in response — treating as new');
            setNewCustomerUI();
        }
    } catch (err) {
        console.error(err);
        customerStatus.textContent = 'Kunne ikke slå kunden op';
        customerStatus.style.color = 'tomato';
    }
}



// Showtime selected: fetch details + seats
async function onShowtimeSelect(s){
    selectedScreening = s;
    selTime.textContent = formatDate(s.startTime || s.time || s.dateTime || s.date || s.showTime);
    seatPricePer = s.price || s.ticketPrice || s.pricePer || null;
    if (seatPricePer) priceInfo.textContent = seatPricePer + ' kr. / stk';
    else priceInfo.textContent = 'Pris ukendt';

    // Show seats panel
    panelSeats.hidden = false;
    seatMap.innerHTML = '';
    screenNote.textContent = `Lærred — Sal ${s.screen || (s.theatre && s.theatre.name) || '—'}`;

    // Load screening details (try to get full seat layout) and available seats
    seatsLoader.innerHTML = '<span class="loader"></span> Henter sæder...';
    try {
        const detail = await fetchScreeningDetail(s);
        screeningDetail = detail;
    } catch (err) {
        console.warn('Kunne ikke hente screening detail:', err);
        screeningDetail = null;
    }

    try {
        const avail = await fetchAvailableSeats(s);
        availableSeats = avail || [];
    } catch (err) {
        console.error('Fejl ved hentning af available seats', err);
        availableSeats = [];
    } finally {
        seatsLoader.innerHTML = '';
    }

    renderSeatLayout();
}

async function fetchScreeningDetail(s){
    // Try to derive screening id
    const id = s.id || s.screeningId || s.showId;
    if (!id) throw new Error('Ingen screening-id i objekt');
    const res = await fetch(`${API_BASE}/screenings/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('No screening detail');
    return await res.json();
}

async function fetchAvailableSeats(s){
    const id = s.id || s.screeningId || s.showId;
    const res = await fetch(`${API_BASE}/screenings/${encodeURIComponent(id)}/available-seats`);
    if (!res.ok) {
        // fallback: return empty array
        return [];
    }
    return await res.json(); // expect array of seat objects
}

function renderSeatLayout(){
    seatMap.innerHTML = '';
    selectedSeatIds.clear();
    updateSelectionUI();

    if (!Array.isArray(availableSeats) || availableSeats.length === 0){
        seatMap.innerHTML = '<div class="muted-small">Ingen sæder tilgængelige.</div>';
        return;
    }

    // Find hvilke rækker og kolonner der findes i denne forestilling
    const rowsSet = new Set(availableSeats.map(s => s.rowNumber || s.row || 1));
    const colsSet = new Set(availableSeats.map(s => s.seatNumber || s.col || 1));

    const rows = Array.from(rowsSet).sort((a,b)=>a-b);
    const cols = Array.from(colsSet).sort((a,b)=>a-b);

    seatMap.style.gridTemplateColumns = `repeat(${cols.length}, auto)`;

    // Lav et map med tilgængelige seats
    const availIds = new Set(availableSeats.map(s => seatIdFromObj(s)));

    // Tegn alle pladser for denne forestilling
    rows.forEach(r => {
        cols.forEach(c => {
            const id = `R${r}S${c}`; // unik id per row+seat
            const occupied = !availIds.has(id);
            seatMap.appendChild(makeSeatNode(id, occupied));
        });
    });
}

// Helper: få seatId fra objekt
function seatIdFromObj(s){
    return s.id || (s.rowNumber != null && s.seatNumber != null ? `R${s.rowNumber}S${s.seatNumber}` : `${s.row}${s.col}`);
}

// makeSeatNode forbliver den samme


// Render when we have complete seats array (each seat may have occupied flag)
function renderFromSeatArray(seats, availList){
    // determine rows (labels) and cols
    const rowLabels = Array.from(new Set(seats.map(s => s.row))).sort();
    const colNums = Array.from(new Set(seats.map(s => s.col))).sort((a,b)=>a-b);
    seatMap.style.gridTemplateColumns = `repeat(${colNums.length}, auto)`;

    // Build map of available seats for quick lookup (backend's /available-seats may contain seat ids)
    const availIds = new Set((availList||[]).map(s => seatIdFromObj(s)));

    seats.forEach(s => {
        const id = seatIdFromObj(s);
        const occupied = s.occupied === true || (availIds.size>0 && !availIds.has(id));
        const node = makeSeatNode(id, occupied);
        seatMap.appendChild(node);
    });
}

// Render when we only have rows & cols counts
function renderFromGrid(rowsNum, colsNum, availList){
    // build row labels A,B,C...
    const rows = Array.from({length:rowsNum}, (_,i)=> String.fromCharCode(65+i));
    const cols = Array.from({length:colsNum}, (_,i)=> i+1);
    seatMap.style.gridTemplateColumns = `repeat(${cols.length}, auto)`;

    const availSet = new Set((availList||[]).map(s => seatIdFromObj(s)));

    rows.forEach(r => {
        cols.forEach(c => {
            const id = `${r}${c}`;
            const occupied = availSet.size>0 ? !availSet.has(id) : false;
            seatMap.appendChild(makeSeatNode(id, occupied));
        });
    });
}

// Render when we only know available seats (cannot show occupied places)
function renderFromAvailableOnly(availList){
    seatMap.style.gridTemplateColumns = `repeat(8, auto)`;
    availList.forEach(s => {
        const id = seatIdFromObj(s);
        // available by definition
        const node = makeSeatNode(id, false);
        seatMap.appendChild(node);
    });
}

// Create seat DOM node
function makeSeatNode(id, occupied){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'seat ' + (occupied ? 'occupied' : 'free');
    btn.dataset.seatId = id;
    btn.title = occupied ? `Optaget — ${id}` : `Vælg sæde ${id}`;
    btn.textContent = id;

    if (!occupied) {
        btn.addEventListener('click', ()=> {
            if (selectedSeatIds.has(id)) {
                selectedSeatIds.delete(id);
                btn.classList.remove('selected');
            } else {
                selectedSeatIds.add(id);
                btn.classList.add('selected');
            }
            updateSelectionUI();
        });
    } else {
        btn.setAttribute('aria-disabled','true');
    }
    return btn;
}



// Update selection summary + enable confirm button
function updateSelectionUI(){
    selSeats.innerHTML = '';
    if (selectedSeatIds.size === 0) {
        selSeats.textContent = '—';
        summaryCount.textContent = '0 valgt';
        confirmBtn.disabled = true;
    } else {
        Array.from(selectedSeatIds).sort().forEach(id => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = id;
            selSeats.appendChild(chip);
        });
        summaryCount.textContent = `${selectedSeatIds.size} valgt`;
        confirmBtn.disabled = false;
    }

    // update price total
    if (seatPricePer) {
        const total = seatPricePer * selectedSeatIds.size;
        priceInfo.textContent = `${seatPricePer} kr. / stk — Total: ${total} kr.`;
    }
}

// Build reservation payload — adjust here if backend expects other fieldnames
/*function buildReservationPayload(name, email, phone){
    // Default assumed body structure (tolerant):
    return {
        // Commonly expected: screeningId OR showId OR screening.id
        screeningId: selectedScreening.id || selectedScreening.screeningId || selectedScreening.showId,
        // seats as array of seat ids (strings) — backend may expect seat numbers/ids or Seat objects
        seatIds: Array.from(selectedSeatIds),
        // customer fields — rename if your CreateReservationRequest expects other names
        customerName: name,
        email: email,
        phone: phone
    };
}*/

function buildReservationPayload(name, email, phone){
    const base = {
        screeningId: selectedScreening.id || selectedScreening.screeningId || selectedScreening.showId,
        seatIds: Array.from(selectedSeatIds).map(n => Number(n)) // DTO kræver Set<Integer>
    };

    if (existingCustomer && existingCustomer.id){
        return { ...base, customerId: existingCustomer.id };
    } else {
        return {
            ...base,
            customer: {
                name: name,
                email: email,
                phone: normalizePhone(phone)
            }
        };
    }
}


// Submit booking
async function handleSubmit(e){
    e.preventDefault();
    formStatus.textContent = '';
    if (!selectedScreening) return alert('Vælg først en forestilling');
    if (selectedSeatIds.size === 0) return alert('Vælg mindst ét sæde');

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    if (!phone) { alert('Udfyld telefon'); return; }
    if (!(existingCustomer && existingCustomer.id)) {
        if (!name || !email) { alert('Udfyld navn og e-mail for ny kunde'); return; }
    }

    confirmBtn.disabled = true;
    formStatus.innerHTML = '<span class="loader"></span> Forsøger at booke...';

    const payload = buildReservationPayload(name, email, phone);

    try {
        const res = await fetch(`${API_BASE}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.status === 201 || res.ok) {
            // success
            const data = await res.json().catch(()=>null);
            formStatus.textContent = 'Booking bekræftet';
            formStatus.style.color = 'var(--beige)';
            // best-effort: mark seats as occupied in UI
            Array.from(selectedSeatIds).forEach(id => {
                const node = seatMap.querySelector(`[data-seat-id="${id}"]`);
                if (node) {
                    node.classList.remove('selected'); node.classList.remove('free'); node.classList.add('occupied');
                    node.setAttribute('aria-disabled','true');
                    node.title = 'Optaget';
                }
            });
            selectedSeatIds.clear();
            updateSelectionUI();
            // show confirmation id if returned
            if (data && (data.reservationId || data.id || data.confirmation)) {
                formStatus.textContent += ` — Ref: ${data.reservationId || data.id || data.confirmation}`;
            }
        } else {
            const txt = await res.text().catch(()=>null);
            throw new Error(txt || `Server returnerede ${res.status}`);
        }
    } catch (err) {
        console.error(err);
        formStatus.textContent = 'Kunne ikke gennemføre booking: ' + (err.message || 'ukendt fejl');
        formStatus.style.color = 'tomato';
    } finally {
        confirmBtn.disabled = false;
    }
}

// Reset UI to start
function resetAll(){
    selectedMovie = null;
    movieScreenings = [];
    selectedScreening = null;
    availableSeats = [];
    screeningDetail = null;
    selectedSeatIds.clear();
    selFilm.textContent = '—';
    selTime.textContent = '—';
    selSeats.textContent = '—';
    priceInfo.textContent = '—';
    panelShowtimes.hidden = true;
    panelSeats.hidden = true;
    seatMap.innerHTML = '';
    formStatus.textContent = '';
    confirmBtn.disabled = true;
    // scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
