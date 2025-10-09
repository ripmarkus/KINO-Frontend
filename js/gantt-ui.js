/**
 * KinoXP Gantt UI Controller
 * Håndterer Frappe Gantt UI og user interactions
 */

class KinoGanttUI {
    constructor() {
        this.api = new KinoAPI();
        this.gantt = null;
        this.currentScreenings = [];

        this.initializeUI();
        this.loadInitialData();
    }

    // Initialiser UI komponenter
    initializeUI() {
        // Sæt default datoer
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        document.getElementById('startDate').value = GanttDataTransformer.formatDate(today);
        document.getElementById('endDate').value = GanttDataTransformer.formatDate(nextWeek);

        // Load teatre til dropdown
        this.loadTheatres();
    }

    // Load initial data
    async loadInitialData() {
        await this.loadWeek();
    }

    // Load teatre til dropdown
    async loadTheatres() {
        try {
            const theatres = await this.api.getTheatres();
            const select = document.getElementById('theatreSelect');

            // Clear existing options (except "Alle sale")
            select.innerHTML = '<option value="">Alle sale</option>';

            if (theatres && theatres.length > 0) {
                theatres.forEach(theatre => {
                    if (theatre && theatre.theatreId && theatre.name) {
                        const option = document.createElement('option');
                        option.value = theatre.theatreId;
                        const capacity = (theatre.numRows || 0) * (theatre.seatsPerRow || 0);
                        option.textContent = `${theatre.name} (${capacity} pladser)`;
                        select.appendChild(option);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading theatres:', error);
            this.showError('Kunne ikke indlæse sale: ' + error.message);
        }
    }

    // Load og vis schedule
    async loadSchedule() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const theatreId = document.getElementById('theatreSelect').value || null;

        if (!startDate || !endDate) {
            this.showError('Vælg venligst start- og slutdato');
            return;
        }

        this.showLoading(true);

        try {
            const screenings = await this.api.getScreenings(startDate, endDate, theatreId);
            this.displayGantt(screenings);
            this.updateStats(screenings);
        } catch (error) {
            this.showError('Kunne ikke indlæse filmschema: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    // Load dagens screenings
    async loadToday() {
        this.showLoading(true);

        try {
            const screenings = await this.api.getTodayScreenings();
            this.displayGantt(screenings);
            this.updateStats(screenings);

            // Opdater datofelter
            const today = GanttDataTransformer.formatDate(new Date());
            document.getElementById('startDate').value = today;
            document.getElementById('endDate').value = today;
        } catch (error) {
            this.showError('Kunne ikke indlæse dagens program: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    // Load ugens screenings
    async loadWeek() {
        this.showLoading(true);

        try {
            const screenings = await this.api.getWeekScreenings();
            this.displayGantt(screenings);
            this.updateStats(screenings);

            // Opdater datofelter
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Mandag
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Søndag

            document.getElementById('startDate').value = GanttDataTransformer.formatDate(startOfWeek);
            document.getElementById('endDate').value = GanttDataTransformer.formatDate(endOfWeek);
        } catch (error) {
            this.showError('Kunne ikke indlæse ugens program: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    // Vis Gantt chart
    displayGantt(screenings) {
        this.currentScreenings = screenings;

        console.log('📊 Displaying screenings:', screenings); // Debug log

        if (!screenings || screenings.length === 0) {
            document.getElementById('gantt').innerHTML =
                '<div class="loading">Ingen filmvisninger fundet for den valgte periode</div>';
            return;
        }

        // Konverter til Gantt format
        const tasks = GanttDataTransformer.screeningsToTasks(screenings);
        console.log('🔄 Converted tasks:', tasks); // Debug log

        if (!tasks || tasks.length === 0) {
            document.getElementById('gantt').innerHTML =
                '<div class="loading">Kunne ikke konvertere filmvisninger til Gantt format</div>';
            return;
        }

        // Valider tasks før Gantt oprettelse
        const validTasks = tasks.filter(task => {
            const isValid = task && task.id && task.name && task.start && task.end;
            if (!isValid) {
                console.warn('⚠️ Invalid task filtered out:', task);
            }
            return isValid;
        });

        if (validTasks.length === 0) {
            document.getElementById('gantt').innerHTML =
                '<div class="loading">Ingen gyldige filmvisninger fundet</div>';
            return;
        }

        console.log('✅ Valid tasks for Gantt:', validTasks);

        // Destroy eksisterende Gantt hvis den findes
        if (this.gantt) {
            document.getElementById('gantt').innerHTML = '';
        }

        try {
            // Opret ny Gantt med minimale indstillinger først
            this.gantt = new Gantt('#gantt', validTasks, {
                header_height: 50,
                column_width: 30,
                step: 24, // 24 timer
                view_modes: ['Day', 'Week', 'Month'],
                bar_height: 20,
                bar_corner_radius: 3,
                padding: 18,
                view_mode: 'Day',
                date_format: 'DD-MM-YYYY',

                // Event handlers
                on_click: (task) => {
                    console.log('🖱️ Task clicked:', task);
                    this.showTaskDetails(task);
                },

                on_date_change: (task, start, end) => {
                    console.log('📅 Date changed:', task, start, end);
                    this.handleTaskDateChange(task, start, end);
                },

                on_view_change: (mode) => {
                    console.log('👀 View mode changed to:', mode);
                }
            });

            console.log('🎉 Gantt chart created successfully!');

        } catch (error) {
            console.error('❌ Error creating Gantt chart:', error);
            console.error('📋 Tasks that caused error:', validTasks);

            // Fallback til simpel liste visning
            let fallbackHTML = '<div class="loading"><h3>Gantt chart fejl - viser liste i stedet:</h3><ul>';
            validTasks.forEach(task => {
                fallbackHTML += `<li><strong>${task.name}</strong><br>`;
                fallbackHTML += `Fra: ${task.start} til: ${task.end}</li>`;
            });
            fallbackHTML += '</ul></div>';

            document.getElementById('gantt').innerHTML = fallbackHTML;
        }
    }

    // Vis task detaljer
    showTaskDetails(task) {
        const data = task.screening_data;
        const startTime = GanttDataTransformer.formatDateTime(data.startTime);
        const endTime = GanttDataTransformer.formatDateTime(data.endTime);

        alert(`🎬 ${data.movieTitle}
        
📍 ${data.theatreName}
⏰ ${startTime} - ${endTime}
⏱️ Varighed: ${data.duration} min
📊 Status: ${data.status}
🎫 Ledige pladser: ${data.availableSeats}/${data.totalSeats}
📈 Udsolgt: ${100 - Math.round((data.availableSeats / data.totalSeats) * 100)}%`);
    }

    // Håndter dato ændring (drag & drop)
    async handleTaskDateChange(task, start, end) {
        const screeningId = task.screening_data.id;
        const newStartTime = start.toISOString().slice(0, 19); // Remove milliseconds og timezone

        try {
            const updates = {
                startTime: newStartTime
            };

            await this.api.updateScreening(screeningId, updates);

            // Opdater task data
            task.screening_data.startTime = newStartTime;
            task.screening_data.endTime = end.toISOString().slice(0, 19);

            this.showSuccess(`Filmvisning "${task.screening_data.movieTitle}" er flyttet til ${GanttDataTransformer.formatDateTime(newStartTime)}`);

        } catch (error) {
            this.showError('Kunne ikke flytte filmvisning: ' + error.message);
            // Genindlæs for at vise korrekte data
            this.loadSchedule();
        }
    }

    // Opdater statistikker
    updateStats(screenings) {
        const stats = GanttDataTransformer.generateStats(screenings);

        document.getElementById('totalScreenings').textContent = stats.totalScreenings;
        document.getElementById('activeTheatres').textContent = stats.activeTheatres;
        document.getElementById('totalMovies').textContent = stats.totalMovies;
        document.getElementById('occupancyRate').textContent = `${stats.occupancyRate}%`;

        document.getElementById('stats').style.display = 'flex';
    }

    // Utility methods
    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
        document.getElementById('gantt').style.display = show ? 'none' : 'block';
    }

    showError(message) {
        // Fjern eksisterende error messages
        const existingErrors = document.querySelectorAll('.error');
        existingErrors.forEach(error => error.remove());

        // Tilføj ny error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;

        document.querySelector('.header').appendChild(errorDiv);

        // Auto-remove efter 5 sekunder
        setTimeout(() => errorDiv.remove(), 5000);
    }

    showSuccess(message) {
        // Simple success notification (kan erstattes med toast library)
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1000;
        `;
        successDiv.textContent = message;

        document.body.appendChild(successDiv);

        setTimeout(() => successDiv.remove(), 3000);
    }
}

// Global functions til HTML onclick events
let ganttUI;

function loadSchedule() {
    ganttUI.loadSchedule();
}

function loadToday() {
    ganttUI.loadToday();
}

function loadWeek() {
    ganttUI.loadWeek();
}

// Initialize når DOM er loaded
document.addEventListener('DOMContentLoaded', () => {
    ganttUI = new KinoGanttUI();
});