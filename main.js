const DATA_URL = 'data/anime.json';
let ANIME_DATA = [];

async function loadData(){
  try{
    const res = await fetch(DATA_URL);
    if(!res.ok) throw new Error('no data');
    ANIME_DATA = await res.json();
  }catch(e){
    // fallback: small inline dataset
    ANIME_DATA = [
      { id:1, title:"Attack on Titan", year:2013, genres:["Action","Drama"], img:"https://via.placeholder.com/400x250?text=AOT", description:"Humanity fights titans." },
      { id:2, title:"Fullmetal Alchemist: Brotherhood", year:2009, genres:["Action","Adventure"], img:"https://via.placeholder.com/400x250?text=FMA", description:"Two brothers search for the Philosopher's Stone." }
    ];
  }
}

function el(tag, props={}, children=[]){
  const e = document.createElement(tag);
  Object.entries(props).forEach(([k,v])=>{ if(k==='class') e.className = v; else if(k==='html') e.innerHTML = v; else e.setAttribute(k,v); });
  (Array.isArray(children)?children:[children]).forEach(c=>{ if(!c) return; if(typeof c==='string') e.appendChild(document.createTextNode(c)); else e.appendChild(c); });
  return e;
}

function renderCards(list){
  const catalogEl = document.getElementById('catalog');
  const emptyState = document.getElementById('empty-state');
  catalogEl.innerHTML = '';
  if(!list.length){ emptyState.hidden = false; return; }
  emptyState.hidden = true;
  const frag = document.createDocumentFragment();
  list.forEach(item=>{
    const card = el('article',{class:'card', role:'listitem'});
    const img = el('img',{class:'thumb', src:item.img, alt:`${item.title} poster`});
    const body = el('div',{class:'card-body'});
    const h = el('h3',{class:'card-title'}, item.title);
    const meta = el('div',{class:'card-meta'}, `${item.year} • ${item.genres.join(', ')}`);
    const actions = el('div',{class:'card-actions'});
    const btn = el('button',{class:'btn primary', type:'button', 'data-id':item.id}, 'Подробнее');
    actions.appendChild(btn);
    body.append(h, meta, actions);
    card.append(img, body);
    frag.appendChild(card);

    btn.addEventListener('click', ()=> openModal(item.id));
  });
  catalogEl.appendChild(frag);
}

function applyFilters(){
  const q = document.getElementById('search').value.trim().toLowerCase();
  const genre = document.getElementById('filter-genre').value;
  const filtered = ANIME_DATA.filter(a=>{
    const matchesQ = q ? a.title.toLowerCase().includes(q) : true;
    const matchesGenre = genre ? a.genres.includes(genre) : true;
    return matchesQ && matchesGenre;
  });
  renderCards(filtered);
}

function populateGenres(){
  const filterGenreEl = document.getElementById('filter-genre');
  const genres = Array.from(new Set(ANIME_DATA.flatMap(a=>a.genres))).sort();
  genres.forEach(g=>{ const opt = document.createElement('option'); opt.value = g; opt.textContent = g; filterGenreEl.appendChild(opt); });
}

function openModal(id){
  const item = ANIME_DATA.find(a=>a.id===id);
  if(!item) return;
  const modal = document.getElementById('modal');
  document.getElementById('modal-img').src = item.img;
  document.getElementById('modal-img').alt = item.title + ' poster';
  document.getElementById('modal-title').textContent = item.title;
  document.getElementById('modal-genres').textContent = item.genres.join(', ');
  document.getElementById('modal-desc').textContent = item.description || '';
  document.getElementById('modal-year').textContent = item.year ? 'Год: ' + item.year : '';
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  const modal = document.getElementById('modal');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

function setupModal(){
  const modal = document.getElementById('modal');
  modal.addEventListener('click', (e)=>{ if(e.target.hasAttribute('data-close')) closeModal(); });
  document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
}

function setupMenu(){
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('site-nav');
  ham.addEventListener('click', ()=>{
    const expanded = ham.getAttribute('aria-expanded') === 'true';
    ham.setAttribute('aria-expanded', String(!expanded));
    if(!expanded){ nav.style.display = 'flex'; nav.classList.add('nav-open'); } else { nav.style.display = ''; nav.classList.remove('nav-open'); }
  });
}

function init(){
  document.getElementById('year').textContent = new Date().getFullYear();
  setupModal(); setupMenu();

  loadData().then(()=>{
    populateGenres();
    renderCards(ANIME_DATA);

    document.getElementById('search').addEventListener('input', debounce(applyFilters, 180));
    document.getElementById('filter-genre').addEventListener('change', applyFilters);
  });
}

function debounce(fn, ms=100){ let t; return (...a)=>{ clearTimeout(t); t = setTimeout(()=>fn.apply(this,a), ms); } }

window.addEventListener('DOMContentLoaded', init);
