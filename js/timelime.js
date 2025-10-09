// ../js/kino.api.js
(() => {
  const API_BASE = 'http://localhost:8080/api';

  class KinoAPI {
    constructor(baseUrl = API_BASE) { this.baseUrl = baseUrl; }

    async _fetch(endpoint, options = {}) {
      const url = `${this.baseUrl}${endpoint}`;
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...(options.headers||{}) },
        ...options
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }

    getWeek()   { return this._fetch('/scheduling/week'); }
    getToday()  { return this._fetch('/scheduling/today'); }
    getRange(startDate, endDate, theatreId=null) {
      let ep = `/scheduling/screenings?startDate=${startDate}&endDate=${endDate}`;
      if (theatreId) ep += `&theatreId=${theatreId}`;
      return this._fetch(ep);
    }
    getTheatres() { return this._fetch('/scheduling/theatres'); }
    updateScreening(id, updates){
      return this._fetch(`/scheduling/screening/${id}`, { method:'PUT', body: JSON.stringify(updates) });
    }
  }

  window.KinoAPI = KinoAPI;
})();
