// ../js/kino.api.js
(() => {
  const API_BASE = `${window.location.origin}/api`;

  class KinoAPI {
    constructor(baseUrl = API_BASE) {
      this.baseUrl = baseUrl.replace(/\/+$/, '');
    }

    async _fetch(endpoint, options = {}) {
      const ep = String(endpoint || '');
      const path = ep.startsWith('/') ? ep : `/${ep}`;
      const url = `${this.baseUrl}${path}`;

      const res = await fetch(url, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Håndter 204/empty body
      const ct = res.headers.get('content-type') || '';
      if (res.status === 204 || !ct.includes('application/json')) return null;

      return res.json();
    }

    getWeek() { return this._fetch('/scheduling/week'); }
    getToday() { return this._fetch('/scheduling/today'); }

    getRange(startDate, endDate, theatreId = null) {
      let ep = `/scheduling/screenings?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
      if (theatreId != null) ep += `&theatreId=${encodeURIComponent(theatreId)}`;
      return this._fetch(ep);
    }

    getTheatres() { return this._fetch('/scheduling/theatres'); }

    updateScreening(id, updates) {
      return this._fetch(`/scheduling/screening/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    }
  }

  window.KinoAPI = KinoAPI;
})();
