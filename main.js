/* Простая логика: данные, рендер, фильтрация и поиск.
   В реальном проекте данные подтягиваются с API/JSON-файла */
const ANIME_DATA = [
  { id:1, title:"Attack on Titan", year:2013, genres:["Action","Drama"], img:"https://via.placeholder.com/400x250?text=AOT" },
  { id:2, title:"Fullmetal Alchemist: Brotherhood", year:2009, genres:["Action","Adventure"], img:"https://via.placeholder.com/400x250?text=FMA" },
  { id:3, title:"Spirited Away", year:2001, genres:["Fantasy","Drama"], img:"https://via.placeholder.com/400x250?text=Spirited+Away" },
  { id:4, title:"My Hero Academia", year:2016, genres:["Action","School"], img:"https://via.placeholder.com/400x250?text=MHA" }
];

document.addEventListener('DOMContentLoaded', () => {
  const catalogEl = document.getElementById('catalog');
  const searchEl = document.getElementById('search');
  const filterGenreEl = document.getElementById('filter-genre');
  const emptyState = document.getElementById('empty-state');
  const yearEl = document.getElementById('year');

  yearEl.textContent = new Date().getFullYear();

  // Собираем уникальные жанры
  const genres = Array.from(new Set(ANIME_DATA.flatMap(a => a.genres))).sort();
  genres.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    filterGenreEl.appendChild(opt);
  });

  function render(list) {
    catalogEl.innerHTML = '';
    if (!list.length) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;
    const frag = document.createDocumentFragment();
    list.forEach(item => {
      const card = document.createElement('article');
      card.className = 'card';
      card.setAttribute('role','listitem');
      card.innerHTML = `
        <img src="${item.img}" alt="${item.title} cover">
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(item.title)}</h3>
          <div class="card-meta">${item.year} • ${item.genres.join(', ')}</div>
        </div>
      `;
      frag.appendChild(card);
    });
    catalogEl.appendChild(frag);
  }

  function escapeHtml(s){ return String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  function applyFilters(){
    const q = searchEl.value.trim().toLowerCase();
    const genre = filterGenreEl.value;
    const filtered = ANIME_DATA.filter(a => {
      const matchesQ = q ? a.title.toLowerCase().includes(q) : true;
      const matchesGenre = genre ? a.genres.includes(genre) : true;
      return matchesQ && matchesGenre;
    });
    render(filtered);
  }

  // Events
  searchEl.addEventListener('input', debounce(applyFilters, 200));
  filterGenreEl.addEventListener('change', applyFilters);

  // initial render
  render(ANIME_DATA);
});

// Простая debounce-функция
function debounce(fn, ms = 100){
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}
