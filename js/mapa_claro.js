/*
  Carrera Animal · Capa de interpretación del mapa (iteración para revisión)
  No modifica el conjunto original de animales, el GPS, los audios ni La pista.
  Se carga DESPUÉS de js/velocidad.js, y se puede quitar sin alterar la app.
*/
(() => {
  'use strict';
  const mapView = document.getElementById('ranking-map-view');
  const mapPins = document.getElementById('world-map-pins');
  const mapSelection = document.getElementById('map-selection');
  const masterSlider = document.getElementById('explore-slider');
  const masterSpeed = document.getElementById('explore-speed');
  const masterSource = document.getElementById('speed-source');
  if (!mapView || !mapPins || !mapSelection || !masterSlider || !masterSpeed) return;
  if (document.getElementById('mcl-guide')) return;

  const css = `
    #ranking-map-view .mcl-guide{margin:0 0 14px;border:1px solid #533d4e;border-radius:12px;overflow:hidden;background:linear-gradient(112deg,#28212e 0%,#1c202a 75%);color:#edeef2}
    .mcl-head{padding:20px 22px 8px;display:flex;align-items:start;justify-content:space-between;gap:18px}
    .mcl-eyebrow{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#e89ab7}
    .mcl-guide h3{font-family:Anton,'Arial Narrow',Impact,sans-serif;letter-spacing:.015em;font-weight:400;font-size:clamp(22px,3vw,34px);line-height:1.18;margin:9px 0;color:#fff}
    .mcl-guide p{font-size:13px;color:#b6b7c1;line-height:1.55;margin:0}
    .mcl-subnote{padding:0 22px 14px}
    .mcl-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:#42404b;border-top:1px solid #46434e}
    .mcl-metric{background:#22232d;padding:14px 20px;min-width:0}
    .mcl-metric b{display:block;font-family:'Space Mono',monospace;color:#fff;font-size:clamp(20px,2.4vw,26px);line-height:1.25;font-variant-numeric:tabular-nums}
    .mcl-metric b.mcl-pink{color:#ff739d}
    .mcl-metric span{display:block;font-size:11px;color:#b6b7c1;margin-top:5px;line-height:1.35}
    .mcl-control{display:flex;flex-wrap:wrap;gap:13px;align-items:center;justify-content:space-between;padding:16px 21px;border-top:1px solid #46434e;background:#1c1f28}
    .mcl-control label{font-size:13px;font-weight:700;color:#fff}
    .mcl-slider-wrap{display:flex;align-items:center;gap:13px;flex:1 1 280px;min-width:0}
    .mcl-slider{accent-color:#ff729b;width:100%;min-width:80px;cursor:pointer}
    .mcl-speed{font-family:'Space Mono',monospace;font-size:15px;min-width:83px;text-align:right;color:#ffc1d4;font-weight:700;white-space:nowrap}
    .mcl-guide .mcl-context{font-size:11px;margin:0;padding:0 22px 10px;color:#999ba9;background:#1c1f28}
    .mcl-challenge{margin:0;padding:9px 22px 14px!important;background:#1c1f28;color:#e4b1c4!important;font-size:11px!important;border-top:1px solid #393741}
    .mcl-how{display:flex;flex-wrap:wrap;align-items:center;gap:13px 19px;padding:12px 16px;margin:0 0 14px;background:#1c2029;border:1px solid #363b49;border-radius:9px}
    .mcl-how strong{font-size:11px;color:#eceef3;text-transform:uppercase;letter-spacing:.07em}
    .mcl-habitats{display:flex;flex-wrap:wrap;gap:11px 16px;align-items:center}
    .mcl-habitats span{font-size:12px;color:#c2c5cd;display:flex;align-items:center;gap:7px}
    .mcl-dot{display:inline-block;flex:none;height:10px;width:10px;border-radius:50%}
    .mcl-samples{display:flex;align-items:end;flex-wrap:wrap;gap:9px 17px}
    .mcl-sample{display:flex;align-items:center;gap:6px;font-size:11px;color:#bfc1ca;white-space:nowrap}
    .mcl-bubble{flex:none;display:inline-block;background:#343442;border:2px solid #e8a8c1;border-radius:50%}
    .mcl-note{padding:0 16px 12px;color:#9297a6;font-size:11px;line-height:1.6}
    .mcl-duel{margin:10px 16px 16px;border:1px solid #484351;border-radius:10px;background:#20232d;padding:18px 19px;color:#edeef2}
    .mcl-duel h3{font-size:clamp(19px,2.6vw,26px);font-family:Anton,'Arial Narrow',Impact,sans-serif;margin:4px 0 6px;font-weight:400}
    .mcl-duel p{font-size:12px;color:#b0b5c1;line-height:1.6;margin:0}
    .mcl-duel-caption{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;justify-content:space-between;margin-bottom:16px}
    .mcl-duel-caption strong{color:#ffc0d4;font-size:13px}
    .mcl-bars{display:grid;gap:10px}
    .mcl-bar-row{display:grid;grid-template-columns:80px minmax(0,1fr) 75px;gap:10px;align-items:center;font-size:12px}
    .mcl-bar-row .mcl-name{color:#d9dce5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .mcl-bar-row .mcl-meter{background:#10151d;border-radius:4px;overflow:hidden;height:17px;position:relative}
    .mcl-bar-row .mcl-fill{height:100%;min-width:2px;border-radius:4px;transition:width .18s ease}
    .mcl-bar-row .mcl-value{text-align:right;font-family:'Space Mono',monospace;white-space:nowrap;color:#efeff5;font-size:11px}
    .mcl-result{font-weight:700;color:#f1d1dc!important;margin:15px 0 7px!important;font-size:13px!important}
    .mcl-method{padding-top:13px;margin-top:12px;border-top:1px solid #383e4a;font-size:11px!important;color:#9ca3b0!important}
    #ranking-map-view .world-map-pin{transition:box-shadow .15s,background .15s,border-color .15s,transform .15s;outline-offset:3px}
    #ranking-map-view .world-map-pin.mcl-slower{box-shadow:0 0 0 2px rgba(255,112,157,.45),0 1px 10px #0009}
    #ranking-map-view .world-map-pin.mcl-faster{opacity:.94}
    #ranking-map-view .world-map-pin:hover,#ranking-map-view .world-map-pin:focus-visible{z-index:80!important;opacity:1;transform:translate(-50%,-50%) scale(1.1)}
    #ranking-map-view .world-map-pin.active{z-index:85!important;opacity:1}
    .mcl-visually-hidden{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
    @media(max-width:700px){.mcl-head{padding:17px 14px 8px}.mcl-subnote{padding:0 14px 13px}.mcl-metric{padding:12px}.mcl-metric b{font-size:19px}.mcl-control{padding:14px}.mcl-guide .mcl-context{padding:0 14px 13px}}
    @media(max-width:420px){.mcl-metrics{grid-template-columns:1fr 1fr}.mcl-metric:nth-child(3){grid-column:1/-1}.mcl-how{gap:10px}.mcl-bar-row{grid-template-columns:58px minmax(0,1fr) 65px;gap:7px}.mcl-duel{margin:10px;padding:14px}.mcl-sample{font-size:10px}}
    @media(prefers-reduced-motion:reduce){.mcl-bar-row .mcl-fill{transition:none}#ranking-map-view .world-map-pin{transition:none}}
  `;
  const style = document.createElement('style');
  style.id = 'mcl-style';
  style.textContent = css;
  document.head.appendChild(style);

  // El botón sigue usando el código de la compañera: esto NO suplanta La pista ni su audio.
  const guide = document.createElement('section');
  guide.className = 'mcl-guide';
  guide.id = 'mcl-guide';
  guide.setAttribute('aria-label', 'Cómo interpretar el mapa de rapidez');
  guide.innerHTML = `
    <div class="mcl-head"><div><span class="mcl-eyebrow">UN MAPA · MUCHAS RAPIDECES</span>
      <h3>¿CUÁNTOS ANIMALES SUPERARÍAS?</h3></div><span aria-hidden="true" style="font-size:26px">🌍</span></div>
    <p class="mcl-subnote">Los círculos sitúan animales en regiones de referencia; su <strong style="color:#fff">tamaño crece con la rapidez</strong> y su color distingue el medio de desplazamiento. Prueba una rapidez y descubre qué lugar ocuparías.</p>
    <div class="mcl-metrics" aria-live="polite" aria-atomic="true">
      <div class="mcl-metric"><b id="mcl-count" class="mcl-pink">—</b><span>animales más lentos que tu referencia</span></div>
      <div class="mcl-metric"><b id="mcl-total">—</b><span>animales visibles en el mapa</span></div>
      <div class="mcl-metric"><b id="mcl-near">—</b><span id="mcl-near-label">tu rival más cercano</span></div>
    </div>
    <div class="mcl-control"><label for="mcl-slider">TU RAPIDEZ DE REFERENCIA</label>
      <div class="mcl-slider-wrap"><input class="mcl-slider" id="mcl-slider" type="range" min="1" max="35" step="0.5" value="12" aria-label="Rapidez hipotética para comparar animales"/><output class="mcl-speed" id="mcl-speed" for="mcl-slider">12 km/h</output></div></div>
    <p class="mcl-context" id="mcl-source">Simulación: usa esta barra o mide tu carrera real con GPS. No es una medición.</p>
    <p class="mcl-challenge">💡 Desafío: pasa de 5 a 20 km/h. ¿Cuántos animales más superarías? ¿Aumenta tanto como tu rapidez?</p>
  `;
  const mapSoundRow = mapView.querySelector('.map-sound-row');
  mapView.insertBefore(guide, mapSoundRow || mapView.firstChild);

  const how = document.createElement('div');
  how.className = 'mcl-how';
  how.id = 'mcl-how';
  how.setAttribute('aria-label', 'Leyenda del mapa');
  const samples = [1, 40, 120, 389].map(kmh => {
    const size = radiusFor(kmh)*2;
    return `<span class="mcl-sample"><i class="mcl-bubble" aria-hidden="true" style="width:${size.toFixed(1)}px;height:${size.toFixed(1)}px"></i>${fmt(kmh)} km/h</span>`;
  }).join('');
  how.innerHTML = `<strong>Escala de tamaños</strong>
    <div class="mcl-samples">${samples}</div>
    <span class="mcl-sample"><i class="mcl-bubble" style="width:16px;height:16px;box-shadow:0 0 0 3px #ff739d77"></i>Halo rosa: más lento que tu referencia</span>`;
  const mapScroll = mapView.querySelector('.world-map-scroll');
  if (mapScroll) mapView.insertBefore(how, mapScroll);

  const note = document.createElement('p');
  note.className = 'mcl-note';
  note.textContent = 'Lectura honesta: los puntos NO representan toda la distribución geográfica de una especie. La escala de círculos está ajustada para que los pequeños se puedan seleccionar; para valores exactos utiliza «Barras». Las velocidades de referencia siguen pendientes de verificación por especie. En celular, desliza el mapa hacia los lados.';
  if (mapScroll) mapView.insertBefore(note, mapScroll.nextSibling);

  const duel = document.createElement('section');
  duel.className = 'mcl-duel';
  duel.id = 'mcl-duel';
  duel.setAttribute('aria-label', 'Comparar la rapidez con el animal seleccionado');
  duel.innerHTML = `
    <div class="mcl-duel-caption"><div><span class="mcl-eyebrow">COMPARACIÓN PRECISA</span><h3 id="mcl-title">SELECCIONA UN ANIMAL DEL MAPA</h3></div><strong id="mcl-gap">10 segundos</strong></div>
    <div class="mcl-bars" role="group" aria-label="Distancias hipotéticas a igual tiempo">
      <div class="mcl-bar-row"><span class="mcl-name">🏃 Tú</span><div class="mcl-meter"><div class="mcl-fill" id="mcl-user-fill" style="background:#ff739d;width:0%"></div></div><span class="mcl-value" id="mcl-user-distance">— m</span></div>
      <div class="mcl-bar-row"><span class="mcl-name" id="mcl-animal-label">Animal</span><div class="mcl-meter"><div class="mcl-fill" id="mcl-animal-fill" style="background:#9b7bf0;width:0%"></div></div><span class="mcl-value" id="mcl-animal-distance">— m</span></div>
    </div>
    <p class="mcl-result" id="mcl-result">Elige un círculo para comparar distancias.</p>
    <p class="mcl-method">Misma duración, 10 segundos: distancia = rapidez (km/h) × 10 / 3,6. Es una comparación hipotética a velocidad constante, NO una predicción de quién ganaría una carrera real. La rapidez media GPS no es equivalente a una velocidad máxima animal.</p>
  `;
  mapSelection.insertAdjacentElement('afterend', duel);

  const ui = {
    slider: document.getElementById('mcl-slider'),
    speed: document.getElementById('mcl-speed'),
    source: document.getElementById('mcl-source'),
    count: document.getElementById('mcl-count'),
    total: document.getElementById('mcl-total'),
    near: document.getElementById('mcl-near'),
    nearLabel: document.getElementById('mcl-near-label'),
    title: document.getElementById('mcl-title'),
    gap: document.getElementById('mcl-gap'),
    userFill: document.getElementById('mcl-user-fill'),
    animalFill: document.getElementById('mcl-animal-fill'),
    userDistance: document.getElementById('mcl-user-distance'),
    animalDistance: document.getElementById('mcl-animal-distance'),
    animalLabel: document.getElementById('mcl-animal-label'),
    result: document.getElementById('mcl-result')
  };

  let userKmh = 12;
  let pending = false;
  function fmt(n) { return Number(n).toLocaleString('es-CL', {maximumFractionDigits:n<1?3:1}); }
  const readSpeed = pin => Number(pin.style.getPropertyValue('--speed-tier'));
  function radiusFor(speed) { return 11 + 16*Math.sqrt(Math.max(0,Math.min(389,speed))/389); }
  const findPins = () => [...mapPins.querySelectorAll('button.world-map-pin')]
    .filter(pin => Number.isFinite(readSpeed(pin)) && readSpeed(pin) >= 0 && pin.dataset.name !== 'Tú');

  function syncOwnSpeed() {
    const value = Number((masterSpeed.textContent || '').trim().replace(',','.'));
    if (!Number.isFinite(value) || value < 0) return;
    userKmh = value;
    const max = Math.max(35,Math.ceil(value/5)*5);
    ui.slider.max = String(max);
    ui.slider.value = String(Math.min(max,value));
    ui.speed.value = fmt(value) + ' km/h';
    const src = (masterSource?.textContent||'').toLowerCase();
    ui.source.textContent = src.includes('gps')
      ? 'GPS: rapidez media estimada de tu carrera. Compárala con cautela frente a máximos animales.'
      : src.includes('demo') || src.includes('demostración')
      ? 'Demostración: esta equivalencia no es una rapidez realmente medida.'
      : 'Simulación: ajusta la barra para explorar. No corresponde a una medición.';
    render();
  }
  function speedChanged(e) {
    const n=Number(e.target.value);
    if (!Number.isFinite(n)) return;
    // Reutiliza el comparador de inicio: así las dos secciones siempre coinciden.
    masterSlider.value = String(n);
    masterSlider.dispatchEvent(new Event('input',{bubbles:true}));
    // No dependemos del orden de los listeners para mostrar el cambio inmediatamente.
    syncOwnSpeed();
  }
  function getSelected(pins) {
    return pins.find(p => p.classList.contains('active')) || null;
  }
  function render() {
    const pins=findPins();
    for (const pin of pins) {
      const n=readSpeed(pin);
      pin.style.setProperty('--r',radiusFor(n).toFixed(2)+'px');
      pin.classList.toggle('mcl-slower',n < userKmh);
      pin.classList.toggle('mcl-faster',n > userKmh);
      pin.setAttribute('aria-description', `Rapidez de referencia ${fmt(n)} kilómetros por hora. ${n<userKmh?'Menor':n>userKmh?'Mayor':'Igual'} que tu referencia de ${fmt(userKmh)} kilómetros por hora.`);
    }
    const slower=pins.filter(p=>readSpeed(p)<userKmh);
    const closest=pins.slice().sort((a,b)=>Math.abs(readSpeed(a)-userKmh)-Math.abs(readSpeed(b)-userKmh))[0];
    ui.count.textContent=String(slower.length);
    ui.total.textContent=String(pins.length);
    ui.near.textContent=closest ? closest.dataset.name : '—';
    ui.nearLabel.textContent=closest ? `cerca de ${fmt(readSpeed(closest))} km/h`:'No hay animales visibles';

    const pin=getSelected(pins) || closest;
    if(!pin){
      ui.title.textContent='NO HAY ANIMALES VISIBLES';
      ui.result.textContent='Activa al menos un filtro para poder comparar.';
      ui.userFill.style.width='0%';ui.animalFill.style.width='0%';
      ui.userDistance.textContent='— m';ui.animalDistance.textContent='— m';
      return;
    }
    const a=readSpeed(pin), youDist=userKmh*10/3.6, animalDist=a*10/3.6;
    const max=Math.max(youDist,animalDist,0.001);
    const name=pin.dataset.name||'Animal';
    const emoji=pin.querySelector('span')?.textContent||'🐾';
    ui.title.textContent=`${emoji} ${name.toUpperCase()}`;
    ui.animalLabel.textContent=`${emoji} ${name}`;
    ui.animalLabel.title=name;
    ui.animalFill.style.background=pin.style.getPropertyValue('--pin-color')||'#9b7bf0';
    ui.userFill.style.width=(100*youDist/max).toFixed(1)+'%';
    ui.animalFill.style.width=(100*animalDist/max).toFixed(1)+'%';
    ui.userDistance.textContent=fmt(youDist)+' m';
    ui.animalDistance.textContent=fmt(animalDist)+' m';
    const difference=Math.abs(youDist-animalDist);
    if(Math.abs(userKmh-a)<0.00001){
      ui.gap.textContent='Empate hipotético';
      ui.result.textContent='Si ambas velocidades fueran constantes, recorrerían la misma distancia.';
    }else if(userKmh>a){
      ui.gap.textContent=`${fmt(difference)} m a tu favor`;
      ui.result.textContent=`A esa rapidez recorrerías ${fmt(difference)} metros más que ${name.toLowerCase()} en 10 segundos.`;
    }else{
      ui.gap.textContent=`${fmt(difference)} m a favor del animal`;
      ui.result.textContent=`A esa rapidez ${name.toLowerCase()} recorrería ${fmt(difference)} metros más que tú en 10 segundos.`;
    }
  }
  function scheduleRender(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(()=>{pending=false;render();});
  }

  ui.slider.addEventListener('input',speedChanged);
  mapPins.addEventListener('click',e=>{
    if(e.target.closest('button.world-map-pin'))requestAnimationFrame(render);
  });
  // Filtros y el resultado GPS hacen que el código original regenere los pins.
  const pinsObserver=new MutationObserver(scheduleRender);
  pinsObserver.observe(mapPins,{childList:true});
  // El resultado GPS y la barra original actualizan esta cifra.
  const speedObserver=new MutationObserver(syncOwnSpeed);
  speedObserver.observe(masterSpeed,{childList:true,characterData:true,subtree:true});
  masterSlider.addEventListener('input',()=>requestAnimationFrame(syncOwnSpeed));
  syncOwnSpeed();
  scheduleRender();
})();
