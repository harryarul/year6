/* =======================================================================
   site.js — shared navigation, footer and subject list for the Year 6 Hub
   -----------------------------------------------------------------------
   Include this on EVERY page, just before </body>:
       <script src="site.js" defer></script>

   It automatically adds:
     • a sticky top navigation bar (highlights the page you're on)
     • a matching footer
   ...and, on the hub page only, it fills <div id="subject-grid"></div>.

   ►► TO EDIT SUBJECTS, change the SUBJECTS list below (one place, all pages).
      Turn a subject ON: set ready:true and add its page to the same folder.
   ======================================================================= */

const SUBJECTS = [
  { name:'English',              short:'English',   file:'english.html',   ready:false,
    desc:'Reading, writing, spelling, grammar and comprehension.',
    accent:'var(--coral)',  dk:'var(--coral-dk)',  icon:'book' },

  { name:'Mathematics',          short:'Maths',     file:'maths.html',     ready:true,
    desc:'Number, measurement, space, statistics — with practice worksheets.',
    accent:'var(--teal)',   dk:'var(--teal-dk)',   icon:'maths' },

  { name:'Science & Technology', short:'Science',   file:'science.html',   ready:false,
    desc:'Living things, materials, forces, and the digital world.',
    accent:'var(--green)',  dk:'var(--green-dk)',  icon:'flask' },

  { name:'History',              short:'History',   file:'history.html',   ready:false,
    desc:'Australia as a nation, democracy, and people of the past.',
    accent:'var(--amber)',  dk:'var(--amber-dk)',  icon:'clock' },

  { name:'Geography',            short:'Geography', file:'geography.html', ready:false,
    desc:'Places, environments, maps and the wider world.',
    accent:'var(--ocean)',  dk:'var(--ocean-dk)',  icon:'globe' },

  { name:'Creative Arts',        short:'Arts',      file:'arts.html',      ready:false,
    desc:'Visual arts, music, drama and dance.',
    accent:'var(--berry)',  dk:'var(--berry-dk)',  icon:'palette' },

  { name:'Health & PE',          short:'Health',    file:'pdhpe.html',     ready:false,
    desc:'Healthy bodies, wellbeing, movement and games.',
    accent:'var(--leaf)',   dk:'var(--leaf-dk)',   icon:'heart' }
];

/* inline SVG icon set (used by the hub grid) */
const ICONS = {
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6C10 4.5 6.5 4.5 4 6v13c2.5-1.5 6-1.5 8 0 2-1.5 5.5-1.5 8 0V6c-2.5-1.5-6-1.5-8 0z"/><path d="M12 6v13"/></svg>',
  maths:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h6M7 5v6"/><path d="M14.5 6l4 4M18.5 6l-4 4"/><path d="M4 17h6"/><circle cx="7" cy="14.3" r=".6" fill="currentColor" stroke="none"/><circle cx="7" cy="19.7" r=".6" fill="currentColor" stroke="none"/><path d="M14 15h6M14 19h6"/></svg>',
  flask:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v6l-4.5 8.5A2 2 0 0 0 7.3 21h9.4a2 2 0 0 0 1.8-3.5L14 9V3"/><path d="M7.5 15h9"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17"/></svg>',
  palette:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.4 0 1.9-1 1.9-1.9 0-1.4 1-1.9 1.9-1.9h1a3.8 3.8 0 0 0 3.7-3.8c0-4.8-3.8-7.4-8.5-7.4z"/><circle cx="8" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="11" r="1" fill="currentColor" stroke="none"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.6-7-9.6A3.6 3.6 0 0 1 12 7.2 3.6 3.6 0 0 1 19 10.4C19 15.4 12 20 12 20z"/><path d="M7.5 12h2l1-2 2 4 1-2h2"/></svg>'
};

/* shared styles for the nav + footer (kept self-contained so any new
   page works even if it only includes site.js) */
const SITE_CSS = `
:root{
  --paper:#fbf6ec; --ink:#2b2b2e; --line:#e6dcc8;
  --teal:#1f7a72; --teal-dk:#155a54;
  --coral:#ee6c4d; --coral-dk:#d4502f;
  --green:#3a9d6b; --green-dk:#2c7a52;
  --amber:#e6a23c; --amber-dk:#c2811f;
  --ocean:#3a7ca5; --ocean-dk:#2c5f7e;
  --berry:#c25b87; --berry-dk:#9e426a;
  --leaf:#7a9e3a;  --leaf-dk:#5f7e2c;
}
.site-nav{position:sticky;top:0;z-index:60;display:flex;align-items:center;gap:14px;
  justify-content:space-between;background:rgba(251,246,236,.92);backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);border-bottom:2px solid var(--line);padding:10px 16px;
  font-family:'Baloo 2',cursive}
.site-nav .brand{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--ink);
  font-size:1.12rem;white-space:nowrap}
.site-nav .brand-mark{width:22px;height:22px;border-radius:7px;background:var(--coral);
  box-shadow:0 2px 0 var(--coral-dk);transform:rotate(8deg)}
.site-nav .nav-links{display:flex;gap:5px;overflow-x:auto;scrollbar-width:none}
.site-nav .nav-links::-webkit-scrollbar{height:0}
.site-nav .navlink{text-decoration:none;color:#6a6357;font-size:.9rem;padding:6px 12px;
  border-radius:20px;white-space:nowrap;border:2px solid transparent;transition:background .12s}
.site-nav a.navlink:hover{background:#fff;border-color:var(--line)}
.site-nav a.navlink.active{color:#fff;background:var(--accent,var(--teal));border-color:transparent}
.site-nav .navlink.soon{color:#bcb2a0;cursor:default}
.site-foot{margin-top:50px;border-top:2px solid var(--line);padding:26px 18px 40px;
  text-align:center;font-family:'Nunito',sans-serif}
.site-foot .foot-row{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 14px;
  margin-bottom:12px;font-family:'Baloo 2',cursive;font-size:.92rem}
.site-foot .foot-row a{color:var(--teal-dk);text-decoration:none}
.site-foot .foot-row a:hover{text-decoration:underline}
.site-foot .foot-row span{color:#bcb2a0}
.site-foot p{color:#9a917f;font-size:.82rem;font-weight:600}
@media print{.site-nav,.site-foot{display:none!important}}
`;

function currentFile(){
  let p = location.pathname.split('/').pop();
  return (!p) ? 'index.html' : p;
}

function buildNav(){
  const cur = currentFile();
  const links = SUBJECTS.map(s=>{
    if(s.ready){
      const active = (s.file===cur) ? ' active' : '';
      return `<a href="${s.file}" class="navlink${active}" style="--accent:${s.accent}">${s.short}</a>`;
    }
    return `<span class="navlink soon" title="Coming soon">${s.short}</span>`;
  }).join('');
  return `<nav class="site-nav">
    <a class="brand" href="index.html"><span class="brand-mark"></span>Year 6 Hub</a>
    <div class="nav-links">${links}</div>
  </nav>`;
}

function buildFooter(){
  const links = SUBJECTS.map(s=>
    s.ready ? `<a href="${s.file}">${s.short}</a>` : `<span>${s.short}</span>`
  ).join('');
  return `<footer class="site-foot">
    <div class="foot-row">${links}</div>
    <p>Year 6 Learning Hub · Aligned to the NSW curriculum, Stage 3 (Years 5–6)</p>
  </footer>`;
}

function buildGrid(){
  return SUBJECTS.map(s=>{
    const inner = `<div class="icon">${ICONS[s.icon]||''}</div>
      <h3>${s.name}</h3><p>${s.desc}</p>
      ${s.ready ? '<span class="cta">Start learning →</span>' : '<span class="soon-badge">Coming soon</span>'}`;
    const style = `--accent:${s.accent};--accent-dk:${s.dk}`;
    return s.ready
      ? `<a class="tile ready" href="${s.file}" style="${style}">${inner}</a>`
      : `<div class="tile soon" style="${style}">${inner}</div>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded',()=>{
  const st = document.createElement('style'); st.textContent = SITE_CSS;
  document.head.appendChild(st);
  document.body.insertAdjacentHTML('afterbegin', buildNav());
  document.body.insertAdjacentHTML('beforeend', buildFooter());
  const grid = document.getElementById('subject-grid');
  if(grid) grid.innerHTML = buildGrid();
});
