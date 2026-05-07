/* =====================================================
   PLAYER CARD — app.js
   TheSportsDB API v1 (key 123, free)
   Implementa los 3 fetch del ejemplo:
     1. searchplayers  → jugador base
     2. lookuphonours  → trofeos ganados
     3. lookupformerteams → historial de equipos
   ===================================================== */

const API = 'https://www.thesportsdb.com/api/v1/json/123';

/* ── DOM refs ── */
const searchWrapper  = document.getElementById('searchWrapper');
const searchInput    = document.getElementById('searchInput');
const searchBtn      = document.getElementById('searchBtn');
const suggestions    = document.getElementById('suggestions');
const searchStatus   = document.getElementById('searchStatus');
const playerPage     = document.getElementById('playerPage');
const backBtn        = document.getElementById('backBtn');
const tabLoader      = document.getElementById('tabLoader');

/* Player hero */
const heroSection    = document.getElementById('heroSection');
const heroBgText     = document.getElementById('heroBgText');
const playerImg      = document.getElementById('playerImg');
const playerImgFb    = document.getElementById('playerImgFallback');
const heroSport      = document.getElementById('heroSport');
const heroName       = document.getElementById('heroName');
const heroMeta       = document.getElementById('heroMeta');
const heroTags       = document.getElementById('heroTags');

/* Tabs */
const tabs           = document.querySelectorAll('.ptab');
const tabContents    = document.querySelectorAll('.tab-content');

/* Tab content zones */
const bioGrid        = document.getElementById('bioGrid');
const bioDesc        = document.getElementById('bioDesc');
const honoursContent = document.getElementById('honoursContent');
const teamsContent   = document.getElementById('teamsContent');

/* ── Estado ── */
let currentPlayerId = null;

/* =====================================================
   BÚSQUEDA
   ===================================================== */
searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
searchInput.addEventListener('input', () => {
  if (!searchInput.value.trim()) hideSuggestions();
});

async function doSearch() {
  const q = searchInput.value.trim();
  if (!q) return;

  hideSuggestions();
  setSearchStatus('loading', '🔍 Buscando jugadores...');

  try {
    // ── FETCH 1: búsqueda de jugadores ──────────────
    const data = await fetchJSON(`${API}/searchplayers.php?p=${encodeURIComponent(q)}`);

    const players = data.player;

    if (!players || players.length === 0) {
      setSearchStatus('error', `No se encontró ningún jugador con "${q}"`);
      return;
    }

    // Un solo resultado → cargar directamente
    if (players.length === 1) {
      hideSearchStatus();
      loadPlayer(players[0]);
      return;
    }

    // Múltiples resultados → mostrar sugerencias
    hideSearchStatus();
    showSuggestions(players.slice(0, 8));

  } catch (err) {
    setSearchStatus('error', 'Error al conectar con la API. Comprueba tu conexión.');
    console.error(err);
  }
}

function showSuggestions(players) {
  suggestions.innerHTML = '';
  players.forEach(p => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    const thumb = p.strCutout || p.strThumb || '';
    item.innerHTML = `
      ${thumb
        ? `<img class="sug-thumb" src="${thumb}" alt="${p.strPlayer}" onerror="this.src=''"/>`
        : `<div class="sug-thumb" style="display:flex;align-items:center;justify-content:center;font-size:1.3rem">👤</div>`}
      <div>
        <div class="sug-name">${p.strPlayer}</div>
        <div class="sug-meta">${[p.strTeam, p.strSport, p.strNationality].filter(Boolean).join(' · ')}</div>
      </div>`;
    item.addEventListener('click', () => {
      hideSuggestions();
      loadPlayer(p);
    });
    suggestions.appendChild(item);
  });
  suggestions.classList.remove('hidden');
}

function hideSuggestions() { suggestions.classList.add('hidden'); }
function hideSearchStatus() { searchStatus.classList.add('hidden'); }

function setSearchStatus(type, msg) {
  searchStatus.className = `search-status ${type}`;
  searchStatus.textContent = msg;
  searchStatus.classList.remove('hidden');
}

/* =====================================================
   CARGAR JUGADOR (los 3 fetches del ejemplo)
   ===================================================== */
async function loadPlayer(jugadorBase) {
  currentPlayerId = jugadorBase.idPlayer;

  // Mostrar la página del jugador, ocultar buscador
  searchWrapper.classList.add('hidden');
  playerPage.classList.remove('hidden');

  // ── FETCH 1: datos base del jugador ─────────────────
  // (ya los tenemos del search, pero consultamos lookup para tener datos completos)
  try {
    const fullData = await fetchJSON(`${API}/lookupplayer.php?id=${currentPlayerId}`);
    const jugador = (fullData.players && fullData.players[0]) || jugadorBase;

    // Log en consola como en el ejemplo original
    console.log(`Jugador: ${jugador.strPlayer}`);
    console.log(`Equipo: ${jugador.strTeam}`);
    console.log(`Nacionalidad: ${jugador.strNationality}`);
    console.log(`Descripción: ${jugador.strDescriptionES || jugador.strDescriptionEN}`);

    renderHero(jugador);
    renderBio(jugador);
  } catch (e) {
    renderHero(jugadorBase);
    renderBio(jugadorBase);
    console.warn('No se pudo cargar el perfil completo, usando datos de búsqueda');
  }

  
  // Cargar honores e historial en paralelo
  loadHonours(currentPlayerId);
  loadFormerTeams(currentPlayerId);
}

/* ── FETCH 2: Trofeos ──────────────────────────────── */
async function loadHonours(playerId) {
  try {
    const data = await fetchJSON(`${API}/lookuphonours.php?id=${playerId}`);
    const honours = data.honours || [];

    // Log en consola como en el ejemplo original
    console.log('Trofeos ganados:');
    if (honours.length === 0) {
      console.log('  (sin datos disponibles)');
    } else {
      honours.forEach(trofeo => {
        console.log(`- ${trofeo.strHonour} (${trofeo.strSeason}) en ${trofeo.strTeam}`);
      });
    }

    renderHonours(honours);
  } catch (err) {
    honoursContent.innerHTML = `<div class="empty-honours"><div class="ei">⚠️</div><p>No se pudieron cargar los trofeos.</p></div>`;
    console.error('Error cargando honours:', err);
  }
}

/* ── FETCH 3: Historial de equipos ─────────────────── */
async function loadFormerTeams(playerId) {
  try {
    const data = await fetchJSON(`${API}/lookupformerteams.php?id=${playerId}`);
    const formerteams = data.formerteams || [];

    // Log en consola como en el ejemplo original
    console.log('Historial de equipos:');
    if (formerteams.length === 0) {
      console.log('  (sin datos disponibles)');
    } else {
      formerteams.forEach(equipo => {
        console.log(`Club: ${equipo.strFormerTeam} | Temporada: ${equipo.strJoined}-${equipo.strDeparted}`);
      });
    }

    renderFormerTeams(formerteams);
  } catch (err) {
    teamsContent.innerHTML = `<div class="empty-honours"><div class="ei">⚠️</div><p>No se pudieron cargar los equipos.</p></div>`;
    console.error('Error cargando formerteams:', err);
  }
}

/* =====================================================
   RENDER HERO
   ===================================================== */
function renderHero(p) {
  // Imagen
  const imgSrc = p.strCutout || p.strThumb || '';
  if (imgSrc) {
    playerImg.src = imgSrc;
    playerImg.alt = p.strPlayer;
    playerImg.classList.remove('hidden');
    playerImgFb.classList.add('hidden');
    playerImg.onerror = () => {
      playerImg.classList.add('hidden');
      playerImgFb.classList.remove('hidden');
    };
  } else {
    playerImg.classList.add('hidden');
    playerImgFb.classList.remove('hidden');
  }

  // Texto grande de fondo (apellido)
  const parts = (p.strPlayer || '').split(' ');
  heroBgText.textContent = parts[parts.length - 1].toUpperCase();

  heroSport.textContent  = p.strSport || '';
  heroName.textContent   = p.strPlayer || '—';

  // Meta: bandera + info
  const age   = p.dateBorn ? calcAge(p.dateBorn) : null;
  const items = [
    p.strNationality ? `🌍 ${p.strNationality}` : null,
    p.strTeam        ? `🏟️ ${p.strTeam}`        : null,
    p.strPosition    ? `📌 ${p.strPosition}`     : null,
    age              ? `🎂 ${age} años`          : null,
  ].filter(Boolean);

  heroMeta.innerHTML = items.map(i => `<span>${i}</span>`).join('');

  // Tags
  const tags = [
    p.strHeight ? `${p.strHeight} altura` : null,
    p.strWeight ? `${p.strWeight} peso`   : null,
    p.strGender === 'Male' ? '♂ Masculino' : p.strGender ? `♀ ${p.strGender}` : null,
  ].filter(Boolean);

  heroTags.innerHTML = tags.map((t, i) =>
    `<span class="htag${i === 0 ? ' orange' : ''}">${t}</span>`
  ).join('');
}

/* =====================================================
   RENDER BIO
   ===================================================== */
function renderBio(p) {
  const fields = [
    { label: 'Nombre completo', value: p.strPlayer },
    { label: 'Equipo actual',   value: p.strTeam },
    { label: 'Deporte',        value: p.strSport },
    { label: 'Posición',       value: p.strPosition },
    { label: 'Nacimiento',     value: formatDate(p.dateBorn) },
    { label: 'Lugar de nac.',  value: p.strBirthLocation },
    { label: 'Nacionalidad',   value: p.strNationality },
    { label: 'Altura',         value: p.strHeight },
    { label: 'Peso',           value: p.strWeight },
    { label: 'Nº camiseta',    value: p.strNumber },
    { label: 'Agente',         value: p.strAgent },
    { label: 'Salario',        value: p.strWage ? `€${p.strWage}` : null },
  ].filter(f => f.value);

  bioGrid.innerHTML = fields.map(f => `
    <div class="bio-item">
      <div class="bio-label">${f.label}</div>
      <div class="bio-value">${f.value}</div>
    </div>`).join('');

  const desc = p.strDescriptionES || p.strDescriptionEN || '';
  bioDesc.innerHTML = desc
    ? `<p>${desc.replace(/\n/g, '</p><p style="margin-top:10px">').slice(0, 1200)}${desc.length > 1200 ? '…' : ''}</p>`
    : `<p class="bio-desc-empty">Sin descripción disponible para este jugador.</p>`;
}

/* =====================================================
   RENDER HONORES
   ===================================================== */
function renderHonours(honours) {
  if (!honours || honours.length === 0) {
    honoursContent.innerHTML = `
      <div class="empty-honours">
        <div class="ei">🏅</div>
        <p>No hay trofeos registrados para este jugador.</p>
      </div>`;
    return;
  }

  // Agrupar por tipo de trofeo
  const groups = {};
  honours.forEach(h => {
    const key = h.strHonour || 'Otros';
    if (!groups[key]) groups[key] = [];
    groups[key].push(h);
  });

  const trophyIcon = name => {
    const n = (name || '').toLowerCase();
    if (n.includes('world'))       return '🌍';
    if (n.includes('champions'))   return '⭐';
    if (n.includes('league') || n.includes('liga')) return '🏆';
    if (n.includes('cup') || n.includes('copa'))    return '🥇';
    if (n.includes('euro'))        return '🇪🇺';
    if (n.includes('golden') || n.includes('ballon')) return '🥇';
    if (n.includes('player'))      return '🧑';
    return '🏅';
  };

  honoursContent.innerHTML = Object.entries(groups).map(([title, items]) => `
    <div class="honours-group">
      <div class="honours-title">${trophyIcon(title)} ${title} <span style="color:var(--orange);margin-left:6px">${items.length}</span></div>
      ${items.map(h => `
        <div class="honour-row">
          <span class="honour-icon">${trophyIcon(h.strHonour)}</span>
          <div style="flex:1;min-width:0">
            <div class="honour-name">${h.strHonour || '—'}</div>
          </div>
          <div class="honour-season">${h.strSeason || ''}</div>
          ${h.strTeam ? `<div class="honour-team">${h.strTeam}</div>` : ''}
        </div>`).join('')}
    </div>`).join('');
}

/* =====================================================
   RENDER HISTORIAL DE EQUIPOS
   ===================================================== */
function renderFormerTeams(teams) {
  if (!teams || teams.length === 0) {
    teamsContent.innerHTML = `
      <div class="empty-honours">
        <div class="ei">🔄</div>
        <p>No hay historial de equipos registrado.</p>
      </div>`;
    return;
  }

  // Ordenar por año de salida descendente
  const sorted = [...teams].sort((a, b) => {
    const ya = parseInt(a.strDeparted) || 0;
    const yb = parseInt(b.strDeparted) || 0;
    return yb - ya;
  });

  teamsContent.innerHTML = `
    <div class="timeline">
      ${sorted.map((equipo, i) => {
        const isCurrent = !equipo.strDeparted || equipo.strDeparted === '' || equipo.strDeparted === '0';
        return `
          <div class="timeline-item" style="animation-delay:${i * 50}ms">
            <div class="timeline-dot ${isCurrent ? 'current' : ''}"></div>
            <div class="timeline-card">
              <div class="tl-team">
                ${equipo.strFormerTeam || '—'}
                ${isCurrent ? '<span class="tl-current">Actual</span>' : ''}
              </div>
              <div class="tl-dates">
                ${equipo.strJoined || '?'} → ${equipo.strDeparted || 'Presente'}
                ${equipo.strSport ? ` · ${equipo.strSport}` : ''}
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

/* =====================================================
   TABS
   ===================================================== */
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
  });
});

/* =====================================================
   VOLVER AL BUSCADOR
   ===================================================== */
backBtn.addEventListener('click', () => {
  playerPage.classList.add('hidden');
  searchWrapper.classList.remove('hidden');
  searchInput.value = '';
  hideSuggestions();
  hideSearchStatus();
  currentPlayerId = null;
  // Reset tabs
  tabs.forEach((t, i) => t.classList.toggle('active', i === 0));
  tabContents.forEach((c, i) => c.classList.toggle('active', i === 0));
});

/* =====================================================
   UTILIDADES
   ===================================================== */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function calcAge(birthDate) {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function formatDate(str) {
  if (!str) return null;
  try {
    return new Date(str).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return str; }
}