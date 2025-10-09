// ../js/showtimes.renderer.js
(() => {
  const fmtTime = (d) => new Date(d).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });

  // farver: sal 1 = grøn, sal 2 = blå, resten = neutral
  const salClass = (theatreId) => {
    if (String(theatreId) === '1') return 'sal-1';
    if (String(theatreId) === '2') return 'sal-2';
    return 'sal-x';
  };

  class ShowtimesTableRenderer {
    constructor(rootId = 'timeline', infoId = 'timelineInfo') {
      this.root = document.getElementById(rootId);
      this.info = document.getElementById(infoId);
    }

    // kompatibilitet med din controller (no-op)
    setVisibleHours() {}
    updateInfo() {
      if (this.info) this.info.style.display = 'none';
    }

    render(screenings) {
      if (!screenings || screenings.length === 0) {
        this.root.innerHTML = '<div class="loading">Ingen filmvisninger fundet</div>';
        return;
      }

      // Group by movie title
      const byMovie = new Map();
      screenings.forEach(s => {
        const title = s?.movie?.title ?? 'Ukendt film';
        const start = new Date(s.startTime);
        const end = new Date(s.endTime);
        const theatreId = s?.theatre?.theatreId ?? 'x';
        const theatreName = s?.theatre?.name ?? 'Ukendt sal';

        if (!byMovie.has(title)) byMovie.set(title, []);
        byMovie.get(title).push({
          start, end, theatreId, theatreName,
          startISO: s.startTime,
          endISO: s.endTime
        });
      });

      // ... i render() lige efter vi har fyldt byMovie:

// Sortér kronologisk pr. film (først efter tid på dagen, så dato)
for (const [, arr] of byMovie) {
  arr.sort((a, b) => {
    const ta = a.start.getHours() * 60 + a.start.getMinutes();
    const tb = b.start.getHours() * 60 + b.start.getMinutes();
    if (ta !== tb) return ta - tb;     // primært: tid på dagen
    return a.start - b.start;          // sekundært: kalenderdato
  });
}


      // Byg tabel
      let html = `
      <div>
      <button class="showtime-chip sal-1" style="width: 100px;">Sal 1</button>
      <button class="showtime-chip sal-2" style="width: 100px;">Sal 2</button>
      </div>
      <br>
      <br>
        <div class="table-wrap">
          <table class="table table--grid showtimes-table" id="scheduleTable">
            <thead>
              <tr>
                <th class="col-movie">Film</th>
                <th>Forestillinger</th>
              </tr>
            </thead>
            <tbody>
      `;

      for (const [movieTitle, shows] of byMovie) {
        const chips = shows.map(show => {
          const timeText = `${fmtTime(show.start)} - ${fmtTime(show.end)}`;
          const cls = salClass(show.theatreId);
          const label = `${timeText} (${show.theatreName})`;
          const safeTitle = movieTitle.replace(/"/g, '&quot;').replace(/</g, '&lt;');
          const safeLabel = label.replace(/"/g, '&quot;').replace(/</g, '&lt;');

          return `
            <button
              class="showtime-chip ${cls}"
              title="${safeLabel}"
              onclick="window.TimelineController?.open('${safeTitle}','${safeLabel}')"
            >${timeText}</button>
          `;
        }).join('');

        html += `
          <tr>
            <td class="movie-cell">
              <div class="movie-title">${movieTitle}</div>
            </td>
            <td class="chips-cell">
              <div class="chips-row">${chips}</div>
            </td>
          </tr>
        `;
      }

      html += `
            </tbody>
          </table>
        </div>


      `;

      this.root.innerHTML = html;
    }
  }

  window.ShowtimesTableRenderer = ShowtimesTableRenderer;
})();
