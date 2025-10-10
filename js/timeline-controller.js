// ../js/timeline.controller.js
(() => {
  const api = new window.KinoAPI();
  const renderer = new window.ShowtimesTableRenderer('timeline','timelineInfo');


  function calcVisibleHours(screenings){
    if (!screenings?.length) return [...Array(16)].map((_,i)=>i+8); // 08–24
    let earliest = 24, latest = 0, night=false;
    screenings.forEach(s=>{
      const a = new Date(s.startTime), b = new Date(s.endTime);
      const sh = a.getHours(), eh = b.getHours();
      earliest = Math.min(earliest, sh);
      latest   = Math.max(latest, eh + (b.getMinutes()>0 ? 1:0));
      if (sh<=6 || eh<=6) night = true;
    });
    if (night) return [...Array(24)].map((_,i)=>i);
    const from = Math.max(7, earliest-1), to = Math.min(24, latest+1);
    return [...Array(to-from)].map((_,i)=>i+from);
  }

  function setStats(screenings){
    const theatres = new Set(), movies = new Set();
    screenings.forEach(s=>{
      const t=s.theatre?.theatreId, m=s.movie?.movieId;
      if (t) theatres.add(t); if (m) movies.add(m);
    });
    document.getElementById('totalScreenings').textContent = screenings.length;
    document.getElementById('activeTheatres').textContent  = theatres.size;
    document.getElementById('totalMovies').textContent     = movies.size;
    document.getElementById('stats').style.display = 'flex';
  }

  async function load(urlFn, label){
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '<div class="loading">Indlæser filmschema...</div>';
    try{
      const data = await urlFn();
      const hours = calcVisibleHours(data);
      renderer.setVisibleHours(hours);
      renderer.render(data);
      renderer.updateInfo();
      setStats(data);
    }catch(err){
      console.error(err);
      timeline.innerHTML = `<div class="loading">Fejl: ${err.message||err}</div>`;
    }
  }

  // Public API for clicks
  window.TimelineController = {
    open(title, time){
      alert(`🎬 ${title}\n\n⏰ ${time}`);
    },
    loadToday(){ load(() => api.getToday(), 'I dag'); },
    loadWeek(){  load(() => api.getWeek(),  'Denne uge'); },
    // Valgfrit: custom range/theatre
    loadRange(startDate, endDate, theatreId=null){
      return load(() => api.getRange(startDate,endDate,theatreId), 'Periode');
    }
  };

  // Hook knapperne i operator.html (de bruger allerede onclick="loadToday()/loadWeek()")
  window.loadToday = () => window.TimelineController.loadToday();
  window.loadWeek  = () => window.TimelineController.loadWeek();

  // Auto-load uge ved DOM ready
  document.addEventListener('DOMContentLoaded', () => window.TimelineController.loadWeek());
})();
