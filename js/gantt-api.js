/**
 * KinoXP Gantt API Client
 * Håndterer alle API calls til backend
 */

class KinoAPI {
    constructor(baseUrl = 'http://localhost:8080/api') {
        this.baseUrl = baseUrl;
    }

    // Utility method til API calls
    async fetchAPI(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error for ${endpoint}:`, error);
            throw error;
        }
    }

    // Hent screenings for periode
    async getScreenings(startDate, endDate, theatreId = null) {
        let endpoint = `/gantt/screenings?startDate=${startDate}&endDate=${endDate}`;
        if (theatreId) {
            endpoint += `&theatreId=${theatreId}`;
        }

        return this.fetchAPI(endpoint);
    }

    // Hent alle teatre
    async getTheatres() {
        return this.fetchAPI('/gantt/theatres');
    }

    // Dagens screenings
    async getTodayScreenings() {
        return this.fetchAPI('/gantt/today');
    }

    // Ugens screenings
    async getWeekScreenings() {
        return this.fetchAPI('/gantt/week');
    }

    // Opdater screening (drag & drop)
    async updateScreening(screeningId, updates) {
        return this.fetchAPI(`/gantt/screening/${screeningId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }
}

/**
 * Data Transformer
 * Konverterer API data til Frappe Gantt format
 */
class GanttDataTransformer {

    // Konverter screenings til Gantt tasks
    static screeningsToTasks(screenings) {
        if (!screenings || screenings.length === 0) {
            return [];
        }

        return screenings.filter(screening => {
            // Filtrer ugyldige screenings
            return screening &&
                screening.showId &&
                screening.startTime &&
                screening.endTime &&
                screening.movie &&
                screening.theatre;
        }).map((screening, index) => {
            // Defensive checks for null/undefined values
            const movie = screening.movie || {};
            const theatre = screening.theatre || {};
            const movieTitle = movie.title || 'Ukendt film';
            const theatreName = theatre.name || 'Ukendt sal';

            // Frappe Gantt kræver specifikke felter
            const task = {
                id: `task-${screening.showId}`, // Unique ID
                name: `${movieTitle} (${theatreName})`, // Task navn
                start: screening.startTime, // ISO string format
                end: screening.endTime, // ISO string format
                progress: this.calculateProgress(screening), // 0-100
                custom_class: screening.status?.toLowerCase() || 'scheduled' // CSS class
            };

            // Tilføj custom data for interaktion
            task.screening_data = {
                id: screening.showId,
                movieTitle: movieTitle,
                theatreName: theatreName,
                theatreId: theatre.theatreId || 0,
                duration: movie.duration || 0,
                status: screening.status || 'UNKNOWN',
                availableSeats: screening.availableSeats?.length || 0,
                totalSeats: (theatre.numRows || 0) * (theatre.seatsPerRow || 0),
                startTime: screening.startTime,
                endTime: screening.endTime
            };

            return task;
        });
    }

    // Beregn fremskridt baseret på sæde reservationer
    static calculateProgress(screening) {
        if (!screening || !screening.theatre) {
            return 0;
        }

        const theatre = screening.theatre;
        const totalSeats = (theatre.numRows || 0) * (theatre.seatsPerRow || 0);

        if (totalSeats === 0) {
            return 0;
        }

        const availableSeats = screening.availableSeats?.length || totalSeats;
        const reservedSeats = totalSeats - availableSeats;

        return Math.round((reservedSeats / totalSeats) * 100);
    }

    // Gruppér tasks efter teater (til visuel organisering)
    static groupTasksByTheatre(tasks) {
        const grouped = {};

        tasks.forEach(task => {
            const theatreId = task.screening_data.theatreId;
            const theatreName = task.screening_data.theatreName;

            if (!grouped[theatreId]) {
                grouped[theatreId] = {
                    id: theatreId,
                    name: theatreName,
                    tasks: []
                };
            }

            // Tilføj teater info til task navn for klarhed
            task.name = `${task.name} (${theatreName})`;
            grouped[theatreId].tasks.push(task);
        });

        return Object.values(grouped);
    }

    // Generér statistikker fra screenings
    static generateStats(screenings) {
        if (!screenings || screenings.length === 0) {
            return {
                totalScreenings: 0,
                activeTheatres: 0,
                totalMovies: 0,
                occupancyRate: 0
            };
        }

        const uniqueTheatres = new Set();
        const uniqueMovies = new Set();

        let totalSeats = 0;
        let reservedSeats = 0;

        screenings.forEach(screening => {
            // Defensive checks
            if (screening.theatre?.theatreId) {
                uniqueTheatres.add(screening.theatre.theatreId);
            }
            if (screening.movie?.movieId) {
                uniqueMovies.add(screening.movie.movieId);
            }

            if (screening.theatre?.numRows && screening.theatre?.seatsPerRow) {
                const theatreCapacity = screening.theatre.numRows * screening.theatre.seatsPerRow;
                const available = screening.availableSeats?.length ?? theatreCapacity;

                totalSeats += theatreCapacity;
                reservedSeats += (theatreCapacity - available);
            }
        });

        const occupancyRate = totalSeats > 0 ? Math.round((reservedSeats / totalSeats) * 100) : 0;

        return {
            totalScreenings: screenings.length,
            activeTheatres: uniqueTheatres.size,
            totalMovies: uniqueMovies.size,
            occupancyRate: occupancyRate
        };
    }

    // Formatér dato til API format
    static formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // Formatér dato og tid til readable format
    static formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleString('da-DK', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}