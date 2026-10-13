(() => {
  "use strict";

  // nombre, km/h, medio, clase, emoji
  const DATA = [
    ["Halcón peregrino",389,"aire","ave","🦅"],
    ["Águila real",320,"aire","ave","🦅"],
    ["Vencejo real",169,"aire","ave","🐦"],
    ["Murciélago",160,"aire","mamífero","🦇"],
    ["Fragata",153,"aire","ave","🐦"],
    ["Paloma mensajera",148,"aire","ave","🕊️"],
    ["Pez vela",110,"agua","pez","🐟"],
    ["Pez espada",97,"agua","pez","🐠"],
    ["Guepardo",120,"tierra","mamífero","🐆"],
    ["Berrendo",88,"tierra","mamífero","🦌"],
    ["Caballo de carrera",88,"tierra","mamífero","🐎"],
    ["León",80,"tierra","mamífero","🦁"],
    ["Ñu",80,"tierra","mamífero","🐃"],
    ["Tiburón mako",74,"agua","pez","🦈"],
    ["Galgo",74,"tierra","mamífero","🐕"],
    ["Canguro rojo",71,"tierra","mamífero","🦘"],
    ["Avestruz",70,"tierra","ave","🐦"],
    ["Liebre",70,"tierra","mamífero","🐇"],
    ["Cebra",64,"tierra","mamífero","🦓"],
    ["Delfín",60,"agua","mamífero","🐬"],
    ["Jirafa",60,"tierra","mamífero","🦒"],
    ["Orca",56,"agua","mamífero","🐋"],
    ["Conejo",56,"tierra","mamífero","🐰"],
    ["Oso pardo",56,"tierra","mamífero","🐻"],
    ["Gato doméstico",48,"tierra","mamífero","🐈"],
    ["Usain Bolt",44.7,"tierra","humano","🏃"],
    ["Elefante",40,"tierra","mamífero","🐘"],
    ["Pingüino papúa",36,"agua","ave","🐧"],
    ["Tortuga marina",35,"agua","reptil","🐢"],
    ["Abeja",29,"aire","insecto","🐝"],
    ["Ardilla",20,"tierra","mamífero","🐿️"],
    ["Mariposa monarca",20,"aire","insecto","🦋"],
    ["Cocodrilo",17,"tierra","reptil","🐊"],
    ["Gallina",14,"tierra","ave","🐔"],
    ["Ratón",13,"tierra","mamífero","🐁"],
    ["Humano trotando",12,"tierra","humano","🚶"],
    ["Mosca doméstica",8,"aire","insecto","🪰"],
    ["Araña",1.9,"tierra","arácnido","🕷️"],
    ["Hormiga",0.3,"tierra","insecto","🐜"],
    ["Tortuga terrestre",0.3,"tierra","reptil","🐢"],
    ["Perezoso",0.27,"tierra","mamífero","🦥"],
    ["Estrella de mar",0.09,"agua","equinodermo","⭐"],
    ["Caracol",0.048,"tierra","molusco","🐌"]
  ].map(([nombre,kmh,medio,clase,emoji]) => ({nombre,kmh,medio,clase,emoji}))
   .sort((a,b) => b.kmh - a.kmh);

  const V_MIN = 0.048, V_MAX = 389;
  const TAP_STEP_METRES = 1.20;
  const COLOR = {tierra:"#e6af70", aire:"#9b7bf0", agua:"#1f97a6", tu:"#ff6d92"};

  // pasos por segundo estimados
  const stride = v => 0.5 * Math.pow(v, 0.4);
  // tono: cuatro octavas desde 80 Hz, logarítmico en velocidad
  const pitch = v => 80 * Math.pow(2, 4 * (Math.log10(Math.max(v,0.001)) - Math.log10(V_MIN)) / (Math.log10(V_MAX) - Math.log10(V_MIN)));

  const nf = (n, d) => n.toLocaleString("es-CL", {minimumFractionDigits:d, maximumFractionDigits:d});
  const fmtSpeed = v => Number.isInteger(v) ? nf(v,0) : v >= 1 ? nf(v,1) : nf(v,3);

  function fmtTime(s){
    if (s < 60) return nf(s, s < 10 ? 1 : 0) + " s";
    if (s < 3600) return Math.floor(s/60) + " min " + nf(s%60,0) + " s";
    if (s < 86400) return Math.floor(s/3600) + " h " + nf((s%3600)/60,0) + " min";
    if (s < 86400*365) return nf(s/86400,1) + " días";
    return nf(s/(86400*365),1) + " años";
  }

  /* ---------------- descubrir primero: comparación personal ---------------- */
  const discoverSpeedEl = document.getElementById("explore-speed");
  const exploreSlider = document.getElementById("explore-slider");
  const speedSourceEl = document.getElementById("speed-source");
  const speedContextEl = document.getElementById("speed-context-text");
  const rivalNameEl = document.getElementById("rival-name");
  const rivalEmojiEl = document.getElementById("rival-emoji");
  const rivalClaimEl = document.getElementById("rival-claim");
  const rivalGapEl = document.getElementById("rival-gap");
  const gapDescEl = document.getElementById("gap-description");
  const rivalContextEl = document.getElementById("rival-context");
  const distanceRowsEl = document.getElementById("distance-rows");
  const distanceAxisEl = document.getElementById("distance-axis");
  const discoveryAnimals = DATA.filter(d => d.medio === "tierra" && d.clase !== "humano");
  let currentExplore = 12;
  let currentRival = null;
  let sourceOfSpeed = "example";
  const distInTen = speed => speed * 10 / 3.6;
  const nearestNext = speed => [...discoveryAnimals].sort((a,b) => Math.abs(a.kmh-speed)-Math.abs(b.kmh-speed))[0] || null;
  function updateDiscovery(value, source="example"){
    currentExplore = Math.max(0, Math.min(389, Number(value)||0));
    sourceOfSpeed = source;
    currentRival = nearestNext(currentExplore) || [...discoveryAnimals].sort((a,b)=>b.kmh-a.kmh)[0];
    discoverSpeedEl.textContent = fmtSpeed(currentExplore);
    speedSourceEl.textContent = source === "gps" ? "TU CARRERA · ESTIMACIÓN GPS" : source === "demo" ? "DEMOSTRACIÓN · NO ES TU RAPIDEZ REAL" : "SIMULACIÓN · NO ES TU MEDICIÓN";
    speedContextEl.textContent = source === "gps" ? "Medición de tu carrera: rapidez media estimada por GPS. Revisa su precisión." : source === "demo" ? "Resultado ficticio del sensor o teclado, no una carrera real." : "Rapidez hipotética: mueve el control para explorar.";
    if (source === "example"){
      exploreSlider.value = String(currentExplore);
    }else{
      // El control permite 1–35 km/h. La medición real no se recorta en los indicadores.
      exploreSlider.value = String(Math.max(1,Math.min(35,currentExplore)));
    }
    if(currentRival){
      const delta=currentExplore-currentRival.kmh;
      rivalEmojiEl.textContent=currentRival.emoji;
      rivalNameEl.textContent=currentRival.nombre;
      rivalClaimEl.textContent=`${fmtSpeed(currentExplore)} km/h está cerca de la rapidez de ${currentRival.nombre.toLowerCase()} (${fmtSpeed(currentRival.kmh)} km/h).`;
      rivalGapEl.textContent=fmtSpeed(Math.abs(delta))+' km/h';
      gapDescEl.textContent=Math.abs(delta)<.001?'¡Misma rapidez de referencia!':delta>0?'más rápido que ese animal':'más lento que ese animal';
      rivalContextEl.textContent='Compara tu resultado con otros animales después de medir tu rapidez.';
    }
    renderDistanceComparison();
  }
  function renderDistanceComparison(){
    // Vecinos más cercanos, separados por velocidad, dan una historia legible.
    const slower = [...discoveryAnimals].filter(d=>d.kmh<=currentExplore).sort((a,b)=>b.kmh-a.kmh).slice(0,2);
    const faster = [...discoveryAnimals].filter(d=>d.kmh>currentExplore).sort((a,b)=>a.kmh-b.kmh).slice(0,2);
    const chosen = [...slower,...faster];
    if(currentRival && !chosen.includes(currentRival)) chosen.push(currentRival);
    const series = [{nombre:"Tú",emoji:"🏃",kmh:currentExplore,tu:true},...chosen].sort((a,b)=>b.kmh-a.kmh);
    const maxDistance = Math.max(...series.map(d=>distInTen(d.kmh)),1);
    const cap = Math.ceil(maxDistance/10)*10 || 10;
    distanceAxisEl.innerHTML = "";
    for(let t=0;t<=4;t++){
      const el=document.createElement("span");el.textContent=nf(cap*t/4,0)+" m";distanceAxisEl.appendChild(el);
    }
    distanceRowsEl.innerHTML="";
    series.forEach(d=>{
      const row=document.createElement("div");row.className="distance-row"+(d.tu?" is-you":"")+(d===currentRival?" is-rival":"");
      const who=document.createElement("span");who.className="distance-name";who.textContent = d.emoji+" "+d.nombre;
      const graph=document.createElement("div");graph.className="distance-bar-track";
      const bar=document.createElement("div");bar.className="distance-bar";bar.style.width=(distInTen(d.kmh)/cap*100).toFixed(3)+"%";
      graph.appendChild(bar);
      const amount=document.createElement("strong");amount.className="distance-amount mono";amount.textContent=nf(distInTen(d.kmh),1)+" m";
      row.append(who,graph,amount);distanceRowsEl.appendChild(row);
    });
    distanceRowsEl.setAttribute("aria-label",series.map(d=>d.nombre+": "+nf(distInTen(d.kmh),1)+" metros hipotéticos en diez segundos").join("; "));
  }
  exploreSlider.addEventListener("input",e=>{updateDiscovery(e.target.value,"example");});
  updateDiscovery(12,"example");

  /* ---------------- audio ---------------- */
  let ac = null, soundOn = true;
  function actx(){
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ return null; } }
    if (ac.state === "suspended") ac.resume();
    return ac;
  }
  function blip(freq, at, dur, vol){
    const c = actx(); if (!c || !soundOn) return;
    const t = at ?? c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "triangle"; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol ?? 0.13, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (dur ?? 0.07));
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + (dur ?? 0.07) + 0.02);
  }
  let previewStop = null;
  function preview(v, medio="tierra"){
    const c = actx(); if (!c || !soundOn) return;
    if (previewStop) previewStop();
    const f = pitch(v), now = c.currentTime, LEN = 1.5;
    // drone: la altura ya lleva el dato aunque no alcance ni un paso
    const o = c.createOscillator(), g = c.createGain();
    o.type = ({tierra:"triangle",aire:"sine",agua:"sawtooth"})[medio] || "triangle"; o.frequency.setValueAtTime(f/2, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.05, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, now + LEN);
    o.connect(g); g.connect(c.destination); o.start(now); o.stop(now + LEN + 0.05);
    // golpes a la cadencia real
    const sps = stride(v), gap = 1 / sps, n = Math.min(Math.floor(LEN / gap) + 1, 24);
    for (let i = 0; i < n; i++) blip(f, now + i * gap, 0.06, 0.1);
    previewStop = () => { try { o.stop(); } catch(e){} previewStop = null; };
  }


  const REPRESENTATIVE_REGIONS = {
    'Halcón peregrino': [38, -110],
    'Águila real': [46, 95],
    'Vencejo real': [41, 14],
    'Murciélago': [24, 48],
    'Fragata': [9, -82],
    'Paloma mensajera': [43, 28],
    'Pez vela': [13, -103],
    'Pez espada': [25, -37],
    'Guepardo': [-5, 33],
    'Berrendo': [41, -105],
    'Caballo de carrera': [51, -6],
    'León': [-8, 24],
    'Ñu': [-17, 30],
    'Tiburón mako': [-24, -25],
    'Galgo': [39, -4],
    'Canguro rojo': [-26, 134],
    'Avestruz': [-25, 18],
    'Liebre': [50, 42],
    'Cebra': [-19, 25],
    'Delfín': [6, -42],
    'Jirafa': [-1, 34],
    'Orca': [52, -146],
    'Conejo': [53, -1],
    'Oso pardo': [56, 112],
    'Gato doméstico': [34, 62],
    'Usain Bolt': [18, -77],
    'Elefante': [5, 39],
    'Pingüino papúa': [-51, -55],
    'Tortuga marina': [-16, 143],
    'Abeja': [12, 14],
    'Ardilla': [47, -88],
    'Mariposa monarca': [22, -102],
    'Cocodrilo': [-13, 119],
    'Gallina': [19, 107],
    'Ratón': [39, 48],
    'Humano trotando': [40, -73],
    'Mosca doméstica': [12, 77],
    'Araña': [-14, -60],
    'Hormiga': [-4, -55],
    'Tortuga terrestre': [16, 21],
    'Perezoso': [-7, -67],
    'Estrella de mar': [-4, 128],
    'Caracol': [46, 9],
  };
  const RECORDINGS = {
    'Halcón peregrino': {file:'Halcón peregrino.ogg',author:'Sternanita3',licence:'CC BY-SA 4.0',description:'Llamada de halcón peregrino'},
    'Guepardo': {file:'Acoustic-Structure-and-Contextual-Use-of-Calls-by-Captive-Male-and-Female-Cheetahs-(Acinonyx-pone.0158546.s001.oga',author:'Smirnova, Volodin, Demina y Volodina',licence:'CC BY 4.0',description:'Vocalizaciones de guepardo en cautiverio'},
    'Caballo de carrera': {file:'Wiehern.ogg',author:'Hü',licence:'Dominio público',description:'Relincho de caballo (ejemplar no identificado como caballo de carrera)'},
    'León': {file:'Lion raring-sound1TamilNadu178.ogg',author:'த*உழவன்',licence:'Dominio público',description:'Rugido de león en cautiverio'},
    'Galgo': {file:'Barking of a dog.ogg',author:'Amada44',licence:'CC BY-SA 3.0',description:'Ladrido de perro; la raza no está identificada'},
    'Gato doméstico': {file:'Meow.ogg',author:'Dan Crosby',licence:'CC BY-SA 3.0',description:'Maullido de gato doméstico'},
    'Gallina': {file:'Medium rooster crowing.ogg',author:'alys / PDSounds',licence:'Dominio público',description:'Gallo y gallinas: vocalización de la misma especie doméstica'},
    'Ardilla': {file:'A three-striped palm squirrel (Funambulus palmarum) chirping 16January2015.oga',author:'Subhashish Panigrahi',licence:'CC BY-SA 4.0',description:'Ardilla de palmeras; especie concreta del registro'},
    'Paloma mensajera': {file:'Dove cooing.ogg',author:'mary905 / PDSounds',licence:'Dominio público',description:'Arrullo de paloma; no hay confirmación de que sea mensajera'},
    'Oso pardo': {file:'Bear growl.ogg',author:'Shizhao',licence:'CC BY 3.0',description:'Gruñido de una cría de oso; la especie exacta no está identificada'},
    'Orca': {file:'Killer whale.ogg',author:'National Park Service',licence:'Dominio público (EE. UU.)',description:'Llamadas de orcas registradas en Alaska'},
    'Elefante': {file:'Elephant voice - trumpeting.ogg',author:'தகவலுழவன்',licence:'CC0',description:'Barrito de elefante'},
    'Abeja': {file:'Bombus buzz.ogg',author:'Mysid',licence:'Dominio público',description:'Zumbido de un abejorro (abeja del género Bombus)'},
    'Jirafa': {file:'Giraffe Hum.oga',author:'Anton Baotic, Florian Sicks y Angela S. Stoeger',licence:'CC BY-SA 4.0',description:'Zumbido nocturno de jirafa registrado en zoológico'},
    'Murciélago': {file:'Ultrasonic bat calls short.ogg',author:'Mnolf',licence:'CC BY-SA 2.0 / GFDL',description:'Ecolocalización de un murciélago, probablemente Pipistrellus pipistrellus, registrada mediante detector ultrasónico'},
  };

  const AUDIO_SPECIES = {
    "Águila real": "Aquila chrysaetos",
    "Vencejo real": "Tachymarptis melba",
    "Murciélago": "Chiroptera",
    "Fragata": "Fregata magnificens",
    "Pez vela": "Istiophorus platypterus",
    "Pez espada": "Xiphias gladius",
    "Berrendo": "Antilocapra americana",
    "Ñu": "Connochaetes taurinus",
    "Tiburón mako": "Isurus oxyrinchus",
    "Canguro rojo": "Osphranter rufus",
    "Avestruz": "Struthio camelus",
    "Liebre": "Lepus europaeus",
    "Cebra": "Equus quagga",
    "Delfín": "Tursiops truncatus",
    "Jirafa": "Giraffa camelopardalis",
    "Orca": "Orcinus orca",
    "Conejo": "Oryctolagus cuniculus",
    "Oso pardo": "Ursus arctos",
    "Elefante": "Loxodonta africana",
    "Pingüino papúa": "Pygoscelis papua",
    "Tortuga marina": "Chelonia mydas",
    "Abeja": "Apis mellifera",
    "Mariposa monarca": "Danaus plexippus",
    "Cocodrilo": "Crocodylus porosus",
    "Ratón": "Mus musculus",
    "Mosca doméstica": "Musca domestica",
    "Araña": "Araneae",
    "Hormiga": "Formicidae",
    "Tortuga terrestre": "Testudo graeca",
    "Perezoso": "Bradypus variegatus",
    "Estrella de mar": "Asteroidea",
    "Caracol": "Cornu aspersum",
    "Ardilla": "Sciuridae",
    "Paloma mensajera": "Columba livia",
    "Galgo": "Canis lupus familiaris",
    "León": "Panthera leo",
    "Guepardo": "Acinonyx jubatus",
    "Halcón peregrino": "Falco peregrinus",
    "Caballo de carrera": "Equus caballus",
    "Gato doméstico": "Felis catus",
    "Gallina": "Gallus gallus domesticus"
};
  const dynamicMissing = new Set();
  const audioLookups = new Map();
  const plainText = html => {const div=document.createElement('div');div.innerHTML=html||'';return div.textContent||'';};
  async function resolveAnimalAudio(d){
    return RECORDINGS[d.nombre] || null;
  }

  const soundURL = file => "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(file);
  const soundInfoURL = file => "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(file);
  const mapSurface = document.getElementById("world-map-surface");
  const mapPins = document.getElementById("world-map-pins");
  const mapSelection = document.getElementById("map-selection");
  const animalSoundFeedback = document.getElementById("animal-sound-feedback");
  let rankingView = "map";
  let mapAnimal = null;
  let animalAudio = null;
  let animalAudioStop = null;
  let mapSoundEnabled=false;
  const mapSoundToggle=document.getElementById("map-sound-toggle");
  mapSoundToggle.addEventListener("click",()=>{
    mapSoundEnabled=!mapSoundEnabled;
    mapSoundToggle.setAttribute("aria-pressed",String(mapSoundEnabled));
    mapSoundToggle.textContent=mapSoundEnabled?"🔊 Desactivar sonido de animales":"🔇 Activar sonido de animales";
    if(!mapSoundEnabled)stopRecording();
  });

  function stopRecording(){
    if(animalAudioStop !== null){clearTimeout(animalAudioStop);animalAudioStop=null;}
    if(animalAudio){animalAudio.pause();animalAudio.currentTime=0;animalAudio=null;}
  }

  async function listenAnimal(d){
    stopRecording();
    if(!mapSoundEnabled)return;
    const source=RECORDINGS[d.nombre] || null;
    if(!source){
      animalSoundFeedback.textContent=`${d.emoji} No se encontró audio de ${d.nombre}.`;
      return;
    }
    const player = new Audio(source.url || soundURL(source.file));
    player.volume=.75;
    animalAudio=player;
    player.addEventListener('error',()=>{
      if(animalAudio!==player)return;
      animalSoundFeedback.textContent = `No se pudo reproducir ${d.nombre}. No se encontró audio reproducible.`;
      showMapAnimal(d);
    },{once:true});
    try{
      await player.play();
      animalAudioFeedback(d, source);
      animalAudioStop=setTimeout(()=>{if(animalAudio===player) stopRecording();},Math.min(6000,(Number.isFinite(player.duration)?player.duration:6)*1000));
    }catch(error){
      if(animalAudio!==player)return;
      animalSoundFeedback.textContent=`El navegador no pudo reproducir ${d.nombre}. No se encontró audio reproducible.`;
      showMapAnimal(d);
    }
  }
  function animalAudioFeedback(d,s){
    animalSoundFeedback.textContent = `🔊 ${d.nombre}: reproduciendo su grabación. Los créditos están al final de la página.`;
  }
  function mapLatLng(d){
    if(!d.tu && d.clase === "humano") return null;
    if(d.tu){
      if(!Number.isFinite(d.mapLat)||!Number.isFinite(d.mapLon))return null;
      return [d.mapLat,d.mapLon];
    }
    return REPRESENTATIVE_REGIONS[d.nombre]||null;
  }
  function showMapAnimal(d){
    mapAnimal=d;
    const s=RECORDINGS[d.nombre];
    const isSelected=chartParticipants.includes(d);
    const locationHint=d.tu ?
      (mapLatLng(d)?'Última ubicación de tu carrera GPS, solo en esta sesión.':'Tu resultado aún no tiene ubicación GPS.') :
      'Selecciona este animal para llevarlo a La pista.';
    mapSelection.replaceChildren();
    const entry=document.createElement('div');entry.className='map-entry';
    const emoji=document.createElement('span');emoji.textContent=d.emoji;
    const content=document.createElement('div');
    const title=document.createElement('strong');title.textContent=d.nombre+' · '+fmtSpeed(d.kmh)+' km/h';
    const context=document.createElement('p');context.textContent=locationHint;
    content.append(title,context);entry.append(emoji,content);
    const actions=document.createElement('div');actions.className='map-actions';
    const choose=document.createElement('button');choose.type='button';choose.textContent=isSelected?'✓ Quitar de La pista':'+ Llevar a La pista';
    choose.onclick=()=>{toggleIntroParticipant(d);showMapAnimal(d);renderMapPins();};
    actions.append(choose);
    mapSelection.append(entry,actions);
    [...mapPins.children].forEach(pin=>pin.classList.toggle('active',pin.dataset.name===d.nombre));
  }
  function renderMapPins(){
    mapPins.replaceChildren();
    const list=visible();
    for(const d of list){
      const ll=mapLatLng(d);
      if(!ll)continue;
      const [lat,lon]=ll;
      const pin=document.createElement('button');
      pin.type='button';pin.className='world-map-pin';
      pin.dataset.name=d.nombre;
      pin.style.setProperty('--x',((lon+180)/360*100).toFixed(3)+'%');
      pin.style.setProperty('--y',((85-lat)/145*100).toFixed(3)+'%');
      pin.style.setProperty('--r',(11+14*Math.pow(Math.max(0,d.kmh)/V_MAX,.60)).toFixed(2)+'px');
      pin.style.setProperty('--speed-tier',String(d.kmh));
      pin.style.setProperty('--pin-color',d.tu?COLOR.tu:COLOR[d.medio]);
      pin.classList.toggle('on',chartParticipants.includes(d));
      pin.classList.toggle('active',mapAnimal===d);
      const emoji=document.createElement('span');emoji.textContent=d.emoji;
      pin.append(emoji);
      pin.title=`${d.nombre} · ${fmtSpeed(d.kmh)} km/h${RECORDINGS[d.nombre]?' · audio disponible':''}`;
      pin.setAttribute('aria-label',`${d.nombre}, ${fmtSpeed(d.kmh)} km/h. Escuchar vocalización disponible y ver opciones.`);
      pin.addEventListener('click',()=>{
        showMapAnimal(d);
        listenAnimal(d);
      });
      mapPins.append(pin);
    }
    if(!mapAnimal || !list.includes(mapAnimal)){
      mapAnimal=list.find(d=>RECORDINGS[d.nombre]) || list[0] || null;
      if(mapAnimal)showMapAnimal(mapAnimal);
      else mapSelection.textContent='No hay animales con los filtros seleccionados.';
    }else showMapAnimal(mapAnimal);
    if(me && !mapLatLng(me)){
      const notice=document.createElement('p');notice.className='map-player-note';
      notice.textContent=`🏃 Tú · ${fmtSpeed(me.kmh)} km/h (${me.tipo==='gps'?'ubicación no disponible':'demo sin ubicación GPS'}). Tu resultado sí aparece en la vista Barras.`;
      mapSelection.append(notice);
    }
  }
  function displayRankingView(){
    document.getElementById('ranking-map-view').hidden=rankingView!=='map';
    document.getElementById('ranking-bars-view').hidden=rankingView!=='bars';
    for(const item of document.querySelectorAll('.ranking-bars-only'))item.hidden=rankingView!=='bars';
    document.querySelectorAll('#ranking-view button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===rankingView)));
    if(rankingView==='map'){
      renderMapPins();
      calloutEl.hidden=true;
    }else render();
  }
  document.getElementById('ranking-view').addEventListener('click',event=>{
    const choice=event.target.closest('button[data-view]');if(!choice)return;
    rankingView=choice.dataset.view;
    displayRankingView();
  });

  /* ---------------- ranking ---------------- */
  const barsEl = document.getElementById("bars");
  const gridEl = document.getElementById("grid");
  const axisEl = document.getElementById("axis");
  const emptyEl = document.getElementById("empty");
  const calloutEl = document.getElementById("callout");
  const tbody = document.getElementById("tbody");

  let scaleMode = "lin";
  const medios = new Set(["tierra","aire","agua"]);
  let selectedRanking = null;
  let chartParticipants = [];
  let me = null;              // {nombre, kmh, ...} del jugador

  const pos = v => scaleMode === "lin"
    ? v / V_MAX
    : (Math.log10(Math.max(v, V_MIN)) - Math.log10(V_MIN)) / (Math.log10(V_MAX) - Math.log10(V_MIN));

  function visible(){
    const list = DATA.filter(d => medios.has(d.medio));
    return me ? [...list, me].sort((a,b) => b.kmh - a.kmh) : list;
  }

  function drawAxis(){
    const ticks = scaleMode === "lin" ? [0,100,200,300,389] : [0.048,0.1,1,10,100,389];
    axisEl.innerHTML = "";
    gridEl.innerHTML = "";
    axisEl.style.marginLeft = getComputedStyle(barsEl).getPropertyValue("--namecol");
    axisEl.style.marginRight = "91px";
    axisEl.style.position = "relative";
    ticks.forEach(t => {
      const p = (t === 0 ? 0 : pos(t)) * 100;
      const s = document.createElement("span");
      s.className = "tick"; s.style.left = p + "%";
      s.textContent = t === 0 ? "0" : fmtSpeed(t);
      axisEl.appendChild(s);
      const g = document.createElement("div");
      g.className = "gline"; g.style.left = p + "%";
      gridEl.appendChild(g);
    });
  }

  function render(){
    const list = visible();
    emptyEl.hidden = list.length > 0;
    [...barsEl.querySelectorAll(".ranking-entry")].forEach(r => r.remove());
    list.forEach(d => {
      const row = document.createElement("button");
      row.className = "row" + (chartParticipants.includes(d) ? " on" : "");
      row.type = "button";
      row.setAttribute("aria-label", `${d.nombre}, ${fmtSpeed(d.kmh)} kilómetros por hora`);
      const c = d.tu ? COLOR.tu : COLOR[d.medio];
      row.innerHTML =
        `<span class="nm"><span class="em">${d.emoji}</span>${d.nombre}</span>` +
        `<span class="plot"><span class="fill" style="background:${c};width:${(pos(d.kmh)*100).toFixed(3)}%"></span></span>` +
        `<span class="vl">${fmtSpeed(d.kmh)}</span>`;
      row.setAttribute("aria-pressed", String(chartParticipants.includes(d)));
      row.addEventListener("click", () => { toggleIntroParticipant(d); selectedRanking=d; });
      const entry=document.createElement("div");entry.className="ranking-entry";
      entry.appendChild(row);
      const rec=RECORDINGS[d.nombre];
      const sound=document.createElement("button");sound.type="button";sound.className="animal-audio";
      sound.textContent=rec?"🔊":"—";sound.disabled=!rec;
      sound.title=rec?"Escuchar sonido real de "+d.nombre:"Grabación no disponible";
      sound.setAttribute("aria-label",rec?"Escuchar grabación de "+d.nombre:"Grabación no disponible");
      if(rec)sound.addEventListener("click",()=>{if(!mapSoundEnabled)mapSoundToggle.click();showMapAnimal(d);listenAnimal(d);});
      entry.appendChild(sound);
      barsEl.appendChild(entry);
    });
    drawAxis();
    if(rankingView === "map"){
      renderMapPins();
      calloutEl.hidden=true;
    } else {
      calloutEl.hidden=false;
      calloutEl.innerHTML = scaleMode === "lin"
        ? "<b>Escala lineal.</b> Todas las barras usan la misma regla: el doble de velocidad ocupa el doble de ancho. Como el halcón es mucho más rápido, el caracol casi no se distingue."
        : "<b>Escala logarítmica.</b> Sirve para ver a los muy lentos y los muy rápidos juntos. Cada salto del eje multiplica la velocidad, en vez de sumar una cantidad fija. Por eso las barras ya no muestran proporciones directas.";
    }
    calloutEl.innerHTML += ` <b>En La pista:</b> ${chartParticipants.length} de 6 seleccionados.`;
  }

  function fillTable(){
    tbody.innerHTML = DATA.map(d =>
      `<tr><td>${d.emoji} ${d.nombre}</td><td>${d.medio}</td><td>${d.clase}</td>` +
      `<td class="n">${fmtSpeed(d.kmh)}</td><td class="n">${nf(d.kmh/3.6, 2)}</td>` +
      `<td class="n">${nf(d.kmh*10/3.6, 1)}</td></tr>`).join("");
  }

  document.getElementById("filters").addEventListener("click", e => {
    const chip = e.target.closest(".chip[data-medio]");
    if (!chip) return;
    const m = chip.dataset.medio, on = chip.getAttribute("aria-pressed") === "true";
    if (on && medios.size === 1) return;
    on ? medios.delete(m) : medios.add(m);
    chip.setAttribute("aria-pressed", String(!on));
    render();
  });

  document.getElementById("scale").addEventListener("click", e => {
    const b = e.target.closest("button[data-scale]"); if (!b) return;
    scaleMode = b.dataset.scale;
    [...e.currentTarget.children].forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    render();
  });

  /* ---------------- tu turno: sensores ---------------- */
  const tapBtn   = document.getElementById("tap");
  const tapRepeatBtn=document.getElementById("tap-repeat");
  const tapCount = document.getElementById("tapCount");
  const tapTime  = document.getElementById("tapTime");
  const mySpeedEl= document.getElementById("myspeed");
  const beatMsg  = document.getElementById("beatmsg");
  const beatList = document.getElementById("beatlist");
  const statusEl = document.getElementById("status");
  const strideWrap = document.getElementById("strideWrap");
  const strideIn = document.getElementById("stride");
  const strideVal= document.getElementById("strideVal");
  const lkA=document.getElementById("lkA"), lvA=document.getElementById("lvA"), luA=document.getElementById("luA");
  const lkB=document.getElementById("lkB"), lvB=document.getElementById("lvB"), luB=document.getElementById("luB");

  let tapAwaitNewStart = false;
  const COPY = {
    motion: "El acelerómetro cuenta <b>impulsos del celular</b>, incluso si solo mueves la mano. La cifra en km/h es una <b>equivalencia simulada</b> con la zancada que elijas; no es tu rapidez al correr.",
    gps:    "El GPS mide desplazamiento, no pasos. Desde Safari del celular, pulsa «Preparar GPS», concede ubicación precisa y espera la señal verde. Pulsa «Empezar carrera» antes de correr y «Terminar carrera» cuando te detengas.",
    tap:    "Cada pulsación representa un paso simulado de 1,20 m. La distancia y los km/h son una equivalencia de juego: no medimos tus pasos reales ni puedes alterar la zancada del teclado."
  };
  const DUR = {motion: 10, tap: 10, gps: 0};   // 0 = hasta que pares

  let mode = "gps";
  let running = false, tStart = 0, tick = null;
  let steps = 0, lastStep = 0, gravEMA = null, above = false, gotMotion = false, motionWatch = null;
  let gpsId = null, gpsMax = 0, gpsNow = 0, lastFix = null;
  let gpsStage = "idle", gpsAccuracy = null, gpsDistanceM = 0, gpsObservedTime = 0;
  let gpsLastSampleAt = null, gpsSamples = 0, gpsSpeeds = [], gpsSession = 0, gpsFinalElapsed = 0;
  const GPS_MAX_ACCURACY = 40; // precisión horizontal aproximada, en metros
  const gpsPanel = document.getElementById("gpsPanel");
  const gpsSignal = document.getElementById("gpsSignal");
  const gpsLight = document.getElementById("gpsLight");
  const gpsHint = document.getElementById("gpsHint");
  const gpsDistanceEl = document.getElementById("gpsDistance");
  const gpsAverageEl = document.getElementById("gpsAverage");
  const gpsCountEl = document.getElementById("gpsCount");
  const gpsCancelBtn = document.getElementById("gpsCancel");
  let lastPerm = "no probado", motionEvents = 0, lastGpsErr = "no probado";
  let strideM = 0.9;
  let taps = 0;

  const say = (html, warn) => { statusEl.innerHTML = html; statusEl.classList.toggle("warn", !!warn); };

  /* --- acelerómetro: detección de pasos por picos --- */
  function onMotion(e){
    const a = e.accelerationIncludingGravity || e.acceleration;
    if (!a || a.x === null || a.x === undefined) return;
    gotMotion = true; motionEvents++;
    const mag = Math.hypot(a.x, a.y, a.z);
    gravEMA = gravEMA === null ? mag : gravEMA * 0.88 + mag * 0.12;   // pasa-altos: saca la gravedad
    const dyn = mag - gravEMA;
    const now = performance.now();
    const TH = 2.2;                                                   // m/s² sobre el reposo
    if (!above && dyn > TH && now - lastStep > 180){                  // 180 ms = tope de 5,5 pasos/s
      above = true; steps++; lastStep = now;
      blip(330 + Math.random()*40, null, 0.045, 0.09);
    } else if (above && dyn < TH * 0.45){ above = false; }
  }

  async function askMotion(){
    if (typeof DeviceMotionEvent === "undefined") return "nosensor";
    if (typeof DeviceMotionEvent.requestPermission === "function"){
      try { return (await DeviceMotionEvent.requestPermission()) === "granted" ? "ok" : "denied"; }
      catch(err){ return "blocked"; }
    }
    return "ok";
  }

  /* --- GPS para carrera real --- */
  const R = 6371000;
  function haversine(a, b){
    const dLat=(b.lat-a.lat)*Math.PI/180, dLon=(b.lon-a.lon)*Math.PI/180;
    const la1=a.lat*Math.PI/180, la2=b.lat*Math.PI/180;
    const h=Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)**2;
    return 2*R*Math.asin(Math.sqrt(h));
  }
  function gpsUi(){
    const stage = gpsStage;
    gpsPanel.hidden = mode !== "gps";
    gpsCancelBtn.hidden = !(stage === "acquiring" || stage === "ready");
    gpsLight.className = "gps-light " + (stage === "running" ? "tracking" : stage === "ready" ? "ready" : stage === "acquiring" ? "searching" : "");
    gpsSignal.textContent = stage === "idle" ? "GPS sin iniciar" : stage === "acquiring" ? "Buscando una señal estable…" : stage === "ready" ? "Señal lista para correr" : "Registrando tu carrera";
    if (mode !== "gps") return;
    if (stage === "idle") gpsHint.textContent = "Sal a un espacio abierto y seguro. Prepara el GPS con el celular quieto.";
    else if (stage === "acquiring") gpsHint.textContent = gpsAccuracy === null ? "Permite el acceso a tu ubicación y espera unos segundos." : `Precisión aproximada: ±${nf(gpsAccuracy,0)} m. Espera una señal de ±${GPS_MAX_ACCURACY} m o mejor.`;
    else if (stage === "ready") gpsHint.textContent = `Precisión aproximada: ±${nf(gpsAccuracy,0)} m. Pulsa iniciar ANTES de correr y deja el celular guardado.`;
    else gpsHint.textContent = `GPS activo${gpsAccuracy === null ? "" : ` · precisión ±${nf(gpsAccuracy,0)} m`}. Corre con cuidado; al terminar, detente antes de tocar la pantalla.`;
    tapBtn.textContent = stage === "idle" ? "1 · Preparar GPS" : stage === "acquiring" ? "Buscando GPS…" : stage === "ready" ? "2 · ¡Empezar carrera!" : "3 · Terminar carrera";
    tapBtn.disabled = stage === "acquiring";
    gpsDistanceEl.textContent = nf(gpsDistanceM,0) + " m";
    gpsCountEl.textContent = stage === "running" ?
      `${gpsSamples} intervalos válidos · Si no aumenta la distancia al correr, el GPS no está entregando velocidad fiable.` :
      stage === "acquiring" ? "Buscando ubicación precisa. Comprueba permiso de ubicación precisa y mantén la página abierta." :
      stage === "ready" ? "Ubicación lista. Toca «Empezar carrera» ANTES de moverte." :
      "Aún no se ha registrado desplazamiento.";
    const elapsed = running ? (performance.now() - tStart) / 1000 : gpsFinalElapsed;
    gpsAverageEl.textContent = nf(elapsed > 0 ? gpsDistanceM / elapsed * 3.6 : 0,1) + " km/h";
  }
  function resetGpsTracking(){
    gpsMax=0; gpsNow=0; gpsDistanceM=0; gpsObservedTime=0; gpsSamples=0;
    gpsSpeeds=[]; gpsLastSampleAt=null; lastFix=null;
    gpsAccuracy=null; gpsFinalElapsed=0;
    gpsDistanceEl.textContent="0 m";
    gpsCountEl.textContent="Aún no se ha registrado desplazamiento.";
    gpsAverageEl.textContent="0,0 km/h";
  }
  function clearGps(){
    ++gpsSession; // ignora callbacks tardíos de una sesión anterior
    if (gpsId !== null){navigator.geolocation.clearWatch(gpsId);gpsId=null;}
    gpsStage="idle";
  }
  function prepareGps(){
    if (!navigator.geolocation || !window.isSecureContext){
      say("El GPS del navegador requiere un celular, permiso de ubicación y un sitio HTTPS (como GitHub Pages).",true);
      return;
    }
    resetGpsTracking();
    gpsStage="acquiring"; gpsUi();
    say("Permite el acceso a la ubicación y espera una señal GPS estable. Todavía no corras.");
    const session=++gpsSession;
    gpsId = navigator.geolocation.watchPosition(pos=>{
      if (session !== gpsSession || mode !== "gps") return;
      const c=pos.coords;
      const accuracy=Number(c.accuracy);
      gpsAccuracy=Number.isFinite(accuracy)?accuracy:null;
      const good = gpsAccuracy !== null && gpsAccuracy <= GPS_MAX_ACCURACY;
      const fix={lat:c.latitude,lon:c.longitude,t:pos.timestamp,accuracy:gpsAccuracy};
      if (gpsStage === "acquiring"){
        if (good){gpsStage="ready"; lastFix=fix; say("¡Señal lista! Inicia la carrera antes de empezar a correr.");}
        gpsUi(); return;
      }
      if (gpsStage === "ready"){
        if (!good){gpsStage="acquiring"; say("La señal se debilitó. Espera a que se estabilice.",true);}
        else lastFix=fix;
        gpsUi(); return;
      }
      if (gpsStage !== "running") return;
      // La incerteza horizontal puede superar el avance entre puntos.
      // No convertimos saltos de ubicación ni lecturas poco precisas en récords.
      if (!good){lastFix=null; gpsLastSampleAt=null; gpsNow=0; gpsUi(); return;}
      let v=Number.isFinite(c.speed) && c.speed >= 0 ? c.speed : null;
      if (v === null && lastFix){
        const dt=(fix.t-lastFix.t)/1000;
        if (dt>=1 && dt<=6){
          const delta=haversine(lastFix,fix);
          if (delta >= Math.max(3,(fix.accuracy+lastFix.accuracy)*0.3)) v=delta/dt;
          else if (delta < 3) v=0;
        }
      }
      lastFix=fix;
      if (v === null || !Number.isFinite(v) || v < 0 || v > 16){gpsUi();return;}
      gpsSpeeds.push(v);
      if (gpsSpeeds.length>3) gpsSpeeds.shift();
      const sorted=[...gpsSpeeds].sort((a,b)=>a-b);
      const smooth=sorted[Math.floor(sorted.length/2)]; // reduce picos aislados
      gpsNow=smooth*3.6;
      gpsMax=Math.max(gpsNow,gpsMax);
      if (gpsLastSampleAt !== null){
        const dt=(fix.t-gpsLastSampleAt)/1000;
        if (dt>0 && dt<=6){
          gpsObservedTime+=dt;
          gpsDistanceM+=smooth*dt;
          gpsSamples++;
        }
      }
      gpsLastSampleAt=fix.t;
      gpsUi();
    }, err=>{
      if (session!==gpsSession) return;
      lastGpsErr={1:"permiso denegado",2:"sin señal",3:"tiempo agotado"}[err.code]||("código "+err.code);
      if (err.code === 3 && gpsStage === "acquiring"){
        say("El GPS tarda en ubicarse. Prueba a cielo abierto; todavía estamos buscando señal.",true); return;
      }
      const wasRunning=gpsStage === "running";
      const msg = err.code===1 ? "Ubicación denegada. Permítela en los ajustes de tu navegador y vuelve a intentar." :
        "No es posible obtener una ubicación fiable. Prueba al aire libre con buena señal.";
      if (wasRunning) finishGps(true);
      else {clearGps();gpsUi();}
      say(msg,true);
    },{enableHighAccuracy:true,maximumAge:0,timeout:20000});
  }
  function beginGpsRun(){
    resetGpsTracking();
    gpsStage="running";
    running=true; tStart=performance.now();
    tapBtn.classList.add("live");
    say("¡Carrera iniciada! Guarda el celular. Cuando termines, detente en un lugar seguro antes de pulsar «Terminar carrera».");
    tick=setInterval(update,200);
    gpsUi();
  }
  function finishGps(abort=false){
    const elapsed=running?(performance.now()-tStart)/1000:0;
    const kmh=elapsed>0?gpsDistanceM/elapsed*3.6:0;
    const distance=gpsDistanceM, samples=gpsSamples, max=gpsMax, coverage=elapsed>0?gpsObservedTime/elapsed:0;
    running=false; gpsFinalElapsed=elapsed; clearInterval(tick);tick=null;
    tapBtn.classList.remove("live"); clearGps(); gpsUi();
    if (abort) return;
    if (samples<2 || distance<10 || elapsed<5 || coverage<0.35){
      say(`No pudimos calcular tu carrera con suficiente confianza: ${samples} intervalos GPS válidos, ${nf(distance,0)} m estimados y ${nf(coverage*100,0)}% del tiempo cubierto. Comprueba la ubicación precisa, usa Safari directamente y prueba 100–200 m al aire libre con la pantalla activa.`,true);
      return;
    }
    const detalle=`Recorriste aproximadamente ${nf(distance,0)} m en ${fmtTime(elapsed)}. Rapidez máxima observada (filtrada): ${nf(max,1)} km/h. ${coverage<0.7 ? "La señal fue intermitente; la medición puede subestimar tu rapidez." : ""}`;
    verdict(Math.round(kmh*10)/10, detalle);
    say("¡Carrera terminada! Tu rapidez es una estimación GPS. Mira a qué animales podrías superar.");
  }

  /* --- ciclo de medición --- */
  function setMode(m){
    if (mode === "gps" && gpsStage !== "idle") finishGps(true);
    else if (running) stop(true);
    mode = m;
    [...document.getElementById("modes").children].forEach(b => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
    strideWrap.hidden = (m !== "motion");
    tapAwaitNewStart = false;
    tapRepeatBtn.hidden=true;
    lkA.textContent = m === "gps" ? "Máxima" : (m === "motion" ? "Impulsos/s" : "Toques/s");
    luA.textContent = m === "gps" ? "km/h" : (m === "tap" ? "toques/s" : "movimientos/s");
    lkB.textContent = m === "gps" ? "Ahora" : "Simulación";
    tapBtn.disabled = false;
    tapBtn.textContent = "Medir";
    tapCount.textContent = m === "gps" ? "0,0 km/h máx." : (m === "motion" ? "— impulsos" : "— toques");
    tapTime.textContent = DUR[m] ? nf(DUR[m],1) + " s" : "0,0 s";
    lvA.textContent = "0,0"; lvB.textContent = "0,0";
    say(COPY[m]);
    gpsUi();
  }

  async function start(){
    actx();
    steps = 0; taps = 0; gravEMA = null; above = false; gotMotion = false; lastStep = 0;
    if (mode === "motion"){
      const r = await askMotion(); lastPerm = r; motionEvents = 0;
      if (r === "nosensor"){ say("Este aparato no tiene acelerómetro (o es un computador de escritorio). Usa el modo teclado.", true); return; }
      if (r === "denied" || r === "blocked"){ say("<b>El visor bloquea el sensor.</b> Esta página corre dentro de un marco que no tiene permiso de acelerómetro, así que el celular ni siquiera alcanza a preguntarte. No es tu teléfono. Sube el archivo <code>index.html</code> a GitHub Pages y ahí funciona. Mientras tanto: modo teclado.", true); return; }
      window.addEventListener("devicemotion", onMotion);
      motionWatch = setTimeout(() => {
        if (!gotMotion){ say("<b>El visor bloquea el sensor.</b> El permiso pasó pero no llega ni un dato: el marco donde vive esta página filtra el acelerómetro. En tu propio sitio (GitHub Pages) funciona. Mientras tanto: modo teclado.", true); stop(true); }
      }, 2000);
      say("Demo activa. Se detectan sacudidas del celular: mover la mano también cuenta. Esto no mide tu velocidad real.");
    } else {
      say("Midiendo. Aprieta espacio o el botón lo más rápido que puedas.");
    }
    running = true; tStart = performance.now();
    tapBtn.classList.add("live");
    if (mode !== "gps") tapBtn.textContent = mode === "tap" ? "¡PULSA ESPACIO!" : "¡Dale!";
    tapBtn.blur();
    tapRepeatBtn.hidden=true;
    tick = setInterval(update, 60);
  }

  function update(){
    const el = (performance.now() - tStart) / 1000;
    if (mode === "gps"){
      lvA.textContent = nf(gpsMax, 1); lvB.textContent = nf(gpsNow, 1);
      tapCount.textContent = nf(gpsMax,1) + " km/h máx.";
      tapTime.textContent = fmtTime(el);
      gpsUi();
      return;
    }
    const n = mode === "tap" ? taps : steps;
    const rate = el > 0.3 ? n / el : 0;
    lvA.textContent = nf(rate, 1);
    lvB.textContent = nf(rate * (mode === "tap" ? TAP_STEP_METRES : strideM) * 3.6, 1);
    tapCount.textContent = n + (mode === "tap" ? " toques" : " impulsos detectados");
    tapTime.textContent = nf(Math.max(DUR[mode] - el, 0), 1) + " s";
    if (el >= DUR[mode]) stop(false);
  }

  function stop(abort){
    if (!running && !abort) return;
    running = false;
    clearInterval(tick); tick = null;
    clearTimeout(motionWatch);
    window.removeEventListener("devicemotion", onMotion);
    tapBtn.classList.remove("live");
    tapBtn.textContent = abort ? "Iniciar prueba" : "↻ Repetir prueba";
    if(mode === "tap" && !abort){
      tapAwaitNewStart = true; tapTime.textContent = "0,0 s";
      tapBtn.disabled=true;tapBtn.textContent="PRUEBA FINALIZADA";
      tapRepeatBtn.hidden=false;
    }
    tapBtn.blur();
    if (abort) return;

    const el = (performance.now() - tStart) / 1000;
    let kmh, detalle;
    if (mode === "gps"){
      finishGps(abort); return;
    } else {
      const n = mode === "tap" ? taps : steps;
      const rate = n / Math.max(el, 0.1);
      const step = mode === "tap" ? TAP_STEP_METRES : strideM;
      kmh = Math.round(rate * step * 3.6 * 10) / 10;
      detalle = `${n} ${mode === "tap" ? "pasos simulados" : "impulsos detectados"} en ${nf(el,1)} s (${nf(rate,1)}/s) × ${nf(step,2)} m ${mode === "tap" ? "por paso fijo" : "de zancada supuesta"}.`;
    }
    verdict(kmh, detalle);
    say(COPY[mode]);
  }

  function verdict(kmh, detalle){
    const simulated = mode !== "gps";
    mySpeedEl.textContent = fmtSpeed(kmh) + " km/h";
    const animals = DATA.filter(d => d.clase !== "humano");
    const beaten = animals.filter(d => d.kmh < kmh);
    const next = [...animals].reverse().find(d => d.kmh > kmh);
    const qualifier = mode === "gps" ? "Rapidez media estimada por GPS, comparada con velocidades máximas aproximadas de animales." : mode === "motion" ? "DEMOSTRACIÓN: impulsos del celular, no pasos comprobados ni rapidez real al correr." : "DEMOSTRACIÓN: simulación desde el teclado, no tu rapidez real al correr.";
    beatMsg.innerHTML = `${detalle} <b>${beaten.length} de ${animals.length}</b> animales quedarían por debajo de tu resultado. ${qualifier}`;
    const rival = document.getElementById("result-rival");
    rival.hidden = false;
    if (next) {
      const difference = next.kmh - kmh;
      rival.innerHTML = `<strong>${next.emoji} Tu próximo rival: ${next.nombre}</strong><br>Alcanza ${fmtSpeed(next.kmh)} km/h. Te faltan <strong>${nf(difference,difference<0.1?2:1)} km/h</strong> para igualarlo.`;
    } else if (kmh <= 0) {
      rival.innerHTML = `<strong>🐌 Tu siguiente desafío:</strong> intenta registrar una velocidad para empezar a competir.`;
    } else {
      rival.innerHTML = `<strong>🏆 Tu resultado supera a todos los competidores de este ranking.</strong> Revisa la calibración de la prueba si la cifra te parece inusual.`;
    }
    beatList.innerHTML = beaten.slice(-4).reverse().map(d => `<li>${d.nombre} ${d.emoji} · ${fmtSpeed(d.kmh)} km/h</li>`).join("");

    if (!me) me = {nombre:"Tú", kmh, medio:"tierra", clase:"humano", emoji:"🏃‍♂️", tu:true};
    else me.kmh = kmh;
    me.tipo = simulated ? "simulada" : "gps";
    if (mode==="gps" && lastFix && Number.isFinite(lastFix.lat) && Number.isFinite(lastFix.lon)){
      me.mapLat=lastFix.lat;me.mapLon=lastFix.lon;
    } else {delete me.mapLat;delete me.mapLon;}
    selectedRanking = me;
    // Coloca al usuario en la pista automáticamente, con hasta seis participantes.
    chartParticipants=[me,...chartParticipants.filter(d=>d!==me)].slice(0,6);
    rebuildIntro();
    render();
    updateDiscovery(kmh, simulated ? "demo" : "gps");
  }

  /* --- diagnóstico --- */
  document.getElementById("diagRun").addEventListener("click", async () => {
    const list = document.getElementById("diagList"), fixEl = document.getElementById("diagFix");
    const enMarco = window.self !== window.top;
    const proto = location.protocol;
    const httpsOk = proto === "https:" || location.hostname === "localhost";
    const hayDM = typeof DeviceMotionEvent !== "undefined";
    const pideiOS = hayDM && typeof DeviceMotionEvent.requestPermission === "function";
    const hayGPS = "geolocation" in navigator;
    let permGPS = "desconocido";
    try { if (navigator.permissions) permGPS = (await navigator.permissions.query({name:"geolocation"})).state; } catch(e){}

    const rows = [
      [httpsOk, "Conexión segura (HTTPS)", proto + "//" + (location.hostname || "archivo local")],
      [!enMarco, enMarco ? "Estás dentro de un marco (iframe)" : "Página dueña de la ventana", enMarco ? "los sensores no cruzan el marco" : "correcto"],
      [hayDM, hayDM ? "El aparato reporta acelerómetro" : "Sin acelerómetro", pideiOS ? "pide permiso al estilo iPhone" : (hayDM ? "no necesita permiso explícito" : "típico de computador de escritorio")],
      [lastPerm === "ok", "Permiso de movimiento", lastPerm],
      [motionEvents > 0, "Datos recibidos del sensor", motionEvents + " lecturas en el último intento"],
      [hayGPS, "El navegador ofrece GPS", "permiso: " + permGPS + " · último error: " + lastGpsErr]
    ];
    list.innerHTML = rows.map(([ok, k, v]) =>
      `<li><span>${ok ? "✅" : "❌"}</span><span><span class="k">${k}</span><span class="v">${v}</span></span></li>`).join("");

    let fix;
    if (!httpsOk && proto === "file:")
      fix = "Abriste el archivo con doble clic. Los sensores <b>nunca</b> funcionan así. Súbelo a GitHub Pages y entra por el link <code>https://…github.io/…</code>";
    else if (enMarco)
      fix = "La página está metida dentro de otra. Ábrela en su propia pestaña, con su URL directa en la barra de direcciones.";
    else if (!hayDM)
      fix = "Este aparato no tiene acelerómetro: casi seguro es un computador. Entra desde el celular.";
    else if (lastPerm === "denied" && pideiOS)
      fix = "iPhone: el permiso salió <b>denied</b> sin preguntarte. Anda a <b>Ajustes → Apps → Safari → Avanzado → Acceso a movimiento y orientación</b> y actívalo. Después recarga. Si usas Chrome o abriste el link desde Instagram/WhatsApp, prueba en Safari directamente.";
    else if (lastPerm === "blocked")
      fix = "La petición de permiso lanzó un error. Pasa casi siempre por no estar en HTTPS o por estar dentro de un marco.";
    else if (lastPerm === "ok" && motionEvents === 0)
      fix = "El permiso se dio pero no llega ni una lectura. Suele ser un navegador dentro de otra app (Instagram, WhatsApp, Gmail). Abre el link en Safari o Chrome de verdad.";
    else if (lastPerm === "no probado")
      fix = "Todavía no aprietas «Medir» en modo movimiento. Hazlo y vuelve a revisar: recién ahí se sabe qué contesta el permiso.";
    else
      fix = "Todo se ve en orden. Si igual no marca pasos, agita más fuerte: el umbral está en 2,2 m/s² sobre el reposo.";
    fixEl.innerHTML = fix; fixEl.hidden = false;
  });

  document.getElementById("modes").addEventListener("click", e => {
    const b = e.target.closest(".mode"); if (b){ setMode(b.dataset.mode); b.blur(); }
  });
  strideIn.addEventListener("input", e => {
    strideM = +e.target.value; strideVal.textContent = nf(strideM, 2);
  });
  tapBtn.addEventListener("click", () => {
    if (mode === "gps"){
      if (gpsStage === "idle") prepareGps();
      else if (gpsStage === "ready") beginGpsRun();
      else if (gpsStage === "running") finishGps(false);
      return;
    }
    if (mode === "tap"){ if (!running && !tapAwaitNewStart) start(); return; }
    running ? stop(false) : start();
  });
  gpsCancelBtn.addEventListener("click",()=>{finishGps(true);say("Preparación cancelada. Puedes volver a intentarlo cuando quieras.");});
  tapRepeatBtn.addEventListener("click",()=>{
    if(mode!=="tap"||running)return;
    tapBtn.disabled=false;tapAwaitNewStart=false;tapRepeatBtn.hidden=true;start();
  });
  tapBtn.addEventListener("pointerdown", e => { if (running && mode === "tap"){ e.preventDefault(); taps++; } });
  document.addEventListener("keydown", e => {
    if (e.code !== "Space" || e.repeat || mode !== "tap") return;
    const a = document.activeElement;
    if (a && /^(input|select|textarea|button)$/i.test(a.tagName)) return;
    e.preventDefault();
    if (!running) return;
    taps++;
  });
  setMode("gps");

  fillTable(); render();
  window.addEventListener("resize", () => drawAxis());


  const initialNames = [
    "Halcón peregrino", "Guepardo", "Pez vela",
    "Galgo", "Gato doméstico", "Caracol"
  ];
  const chartColors = ["#9b7bf0", "#c4821f", "#1f97a6", "#e85d75", "#7fc4ad", "#c8ccd6"];
  const introSvg = document.getElementById("intro-svg");
  const introTime = document.getElementById("intro-time");
  const introLegend = document.getElementById("intro-legend");
  const introStatus = document.getElementById("intro-status");
  const introSelectionInfo = document.getElementById("intro-selected");
  const introWinner = document.getElementById("intro-winner");
  const introReplay = document.getElementById("intro-replay");
  const NS = "http://www.w3.org/2000/svg";
  const graph = {left:104,right:822,top:52,bottom:356,duration:8,maxDistance:900,laneGap:48};
  const trackX = d => graph.left + (Math.max(0,Math.min(d,graph.maxDistance)) / graph.maxDistance) * (graph.right-graph.left);
  const laneY = i => graph.top + 28 + i * graph.laneGap;
  let introAudio = false;
  let introRAF = null;
  let introStarted = 0;
  let introElapsed = 0;
  let introNextTone = 0;
  let introLines = [];
  let cursor = null;
  let introRunning = false;

  function svgNode(tag,attrs={},parent=introSvg){
    const element = document.createElementNS(NS,tag);
    for (const [key,value] of Object.entries(attrs)) element.setAttribute(key,String(value));
    parent.appendChild(element);
    return element;
  }

  function svgLabel(x,y,label,attrs={}){
    const element = svgNode("text",{x,y,fill:"#a3a8b5","font-family":"Space Mono, monospace","font-size":11,...attrs});
    element.textContent=label;
    return element;
  }

  function niceStep(value){
    const exponent=Math.floor(Math.log10(Math.max(value,0.000001)));
    const power=10**exponent;
    const fraction=value/power;
    const nice=fraction<=1 ? 1 : fraction<=2 ? 2 : fraction<=2.5 ? 2.5 : fraction<=5 ? 5 : 10;
    return nice*power;
  }

  function metresLabel(value){
    if(value===0) return "0";
    if(value>=10) return nf(value,value%1===0?0:1);
    if(value>=1) return nf(value,value%1===0?0:2);
    if(value>=0.1) return nf(value,2);
    if(value>=0.01) return nf(value,3);
    return nf(value,4);
  }

  function chartColor(animal,index){
    if(animal.tu) return COLOR.tu;
    const withoutPlayer=chartColors.filter(c=>c!==COLOR.tu);
    return chartParticipants.some(d=>d.tu) ? withoutPlayer[index%withoutPlayer.length] : chartColors[index%chartColors.length];
  }

  function updateIntroFocus(){
    if(!chartParticipants.includes(selectedRanking)) selectedRanking=chartParticipants[0] || null;
    introLines.forEach(({animal,group,line,chip})=>{
      const active=animal===selectedRanking;
      chip.dataset.active=String(active);
      chip.setAttribute("aria-pressed",String(active));
      group.setAttribute("opacity",active?1:.6);
      group.setAttribute("data-focused",String(active));
    });
    const focused=introLines.find(d=>d.animal===selectedRanking);
    if(focused) introSvg.appendChild(focused.group);
    const animal=selectedRanking;
    if(animal){
      const distance=animal.kmh/3.6*8;
      const note=animal.tu
        ? (animal.tipo==="gps" ? "Tu resultado estimado por GPS" : "Tu equivalencia simulada")
        : "Velocidad máxima aproximada";
      introSelectionInfo.innerHTML=`${animal.emoji} <strong>${animal.nombre}</strong> · <span class="mono">${fmtSpeed(animal.kmh)} km/h</span> · <span class="mono">${metresLabel(distance)} m en 8 s</span> · ${note}`;
    }
  }

  function setIntroTime(t){
    introElapsed=t;
    introTime.textContent=nf(t,1)+" s";
    introLines.forEach(({animal,group,marker,index})=>{
      const distance=animal.kmh/3.6*t;
      const x=trackX(distance);
      marker.setAttribute("x",x);
      marker.setAttribute("y",laneY(index));
      marker.setAttribute("opacity",1);
      const shadow=group.querySelector("ellipse");
      if(shadow) shadow.setAttribute("cx",x);
    });
  }

  function rebuildIntro(){
    stopIntroVoice();
    if(introRAF!==null) cancelAnimationFrame(introRAF);
    introRAF=null;
    introRunning=false;
    introWinner.hidden=true;
    introReplay.textContent="▶ Iniciar simulación";
    introLegend.replaceChildren();
    introSvg.replaceChildren();
    introLines=[];

    const maxSpeed=Math.max(...chartParticipants.map(d=>d.kmh),0.01);
    graph.maxDistance=maxSpeed*graph.duration/3.6;
    const trackTop=graph.top;
    const laneHeight=graph.laneGap;
    const trackBottom=trackTop+chartParticipants.length*laneHeight+10;

    // A subdued athletics track, viewed from above.
    svgNode("rect",{x:14,y:12,width:872,height:386,rx:16,fill:"#263a32"});
    svgNode("rect",{x:28,y:24,width:844,height:362,rx:18,fill:"#31483d",stroke:"#496254","stroke-width":1});
    svgNode("rect",{x:graph.left-16,y:trackTop-18,width:graph.right-graph.left+32,height:trackBottom-trackTop+26,rx:10,fill:"#553940",stroke:"#92777a","stroke-width":2});
    chartParticipants.forEach((animal,i)=>{
      const y=laneY(i);
      svgNode("rect",{x:graph.left-12,y:y-laneHeight/2+1,width:graph.right-graph.left+24,height:laneHeight,fill:i%2===0?"#624149":"#593a42",opacity:.72});
      if(i>0) svgNode("line",{x1:graph.left-12,y1:y-laneHeight/2,x2:graph.right+12,y2:y-laneHeight/2,stroke:"#c4b4ad","stroke-width":1.4,opacity:.72});
      svgNode("circle",{cx:graph.left-1,cy:y,r:10,fill:"#e2d7cb",opacity:.95});
      svgLabel(graph.left-1,y+3,String(i+1),{fill:"#3e3033","font-size":10,"font-weight":700,"text-anchor":"middle"});
    });
    svgNode("line",{x1:graph.left+15,y1:trackTop-15,x2:graph.left+15,y2:trackBottom+8,stroke:"#e0d5c8","stroke-width":2,opacity:.9});
    const finishWidth=10, finishCell=8;
    for(let row=0;row<Math.ceil((trackBottom-trackTop+26)/finishCell);row++){
      for(let col=0;col<2;col++){
        svgNode("rect",{x:graph.right-5+col*finishWidth,y:trackTop-17+row*finishCell,width:finishWidth,height:finishCell,fill:(row+col)%2===0?"#d9d0c5":"#43373a",opacity:.92});
      }
    }
    svgLabel(graph.left-2,trackTop-27,"PARTIDA",{fill:"#e0d5c8","font-size":10});
    svgLabel(graph.right+2,trackTop-27,`${metresLabel(graph.maxDistance)} m · 8 s`,{fill:"#e0d5c8","font-size":10,"text-anchor":"end"});
    for(let i=0;i<=4;i++){
      const x=graph.left+(graph.right-graph.left)*i/4;
      const metres=graph.maxDistance*i/4;
      svgNode("line",{x1:x,y1:trackTop-15,x2:x,y2:trackBottom+8,stroke:"#c7b8b1","stroke-width":1,"stroke-dasharray":"2 7",opacity:.18});
      svgLabel(x,trackBottom+24,`${metresLabel(metres)} m`,{fill:"#d2c4bc","font-size":10,"text-anchor":"middle"});
    }
    svgLabel(450,397,"EJE X · DISTANCIA RECORRIDA (METROS)",{fill:"#c1d0c5","font-size":11,"text-anchor":"middle"});
    svgLabel(45,210,"EJE Y · PARTICIPANTES",{fill:"#c1d0c5","font-size":11,"text-anchor":"middle",transform:"rotate(-90 45 210)"});

    introLines=chartParticipants.map((animal,index)=>{
      const color=chartColor(animal,index);
      const group=svgNode("g");
      const shadow=svgNode("ellipse",{cx:graph.left,cy:laneY(index)+8,rx:13,ry:3,fill:"#1c2020",opacity:.58},group);
      const marker=svgNode("text",{x:graph.left,y:laneY(index),"font-size":27,"text-anchor":"middle","dominant-baseline":"central","paint-order":"stroke","stroke":"#2b2427","stroke-width":.8},group);
      marker.textContent=animal.emoji;
      svgNode("circle",{cx:graph.left-16,cy:laneY(index),r:3.5,fill:color,stroke:"#f0e8de","stroke-width":.8},group);
      const chip=document.createElement("button");
      chip.type="button";
      chip.className="intro-chip";
      chip.style.setProperty("--intro-color",color);
      chip.innerHTML=`<span class="intro-chip-dot"></span><span>${animal.emoji} ${animal.nombre}</span>`;
      chip.addEventListener("click",()=>{
        selectedRanking=animal;
        updateIntroFocus();
        render();
        if(introAudio){if(introRunning)startIntroVoice(animal);else previewIntroSound(animal);}
      });
      introLegend.appendChild(chip);
      return {animal,group,marker,shadow,index,chip};
    });
    introStatus.textContent=`${chartParticipants.length} de 6 competidores · selecciona desde el mapa o las barras`;
    introReplay.disabled = chartParticipants.length===0;
    if(!chartParticipants.length)introSelectionInfo.textContent='La pista está vacía. Elige uno o varios animales en el mapa o el ranking.';
    setIntroTime(0);
    updateIntroFocus();
  }

  function toggleIntroParticipant(animal){
    const index=chartParticipants.indexOf(animal);
    if(index>=0){
      chartParticipants.splice(index,1);
      selectedRanking=chartParticipants[0] || null;
    }else{
      if(chartParticipants.length===6) chartParticipants.shift();
      chartParticipants.push(animal);
      selectedRanking=animal;
    }
    rebuildIntro();
    render();
  }

  let introVoice=null;
  function stopIntroVoice(){
    if(!introVoice)return;
    const voice=introVoice;
    introVoice=null;
    const now=voice.context.currentTime;
    try{
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setTargetAtTime(.00001,now,.08);
      voice.osc.stop(now+.35);
      voice.layer.stop(now+.35);
    }catch(error){}
  }
  function startIntroVoice(animal){
    stopIntroVoice();
    if(!introAudio||!introRunning||!animal)return;
    const context=actx();if(!context)return;
    const osc=context.createOscillator();
    const layer=context.createOscillator();
    const layerGain=context.createGain();
    const filter=context.createBiquadFilter();
    const gain=context.createGain();
    const pan=context.createStereoPanner?context.createStereoPanner():null;
    const normalized=Math.max(0,Math.min(1,(Math.log10(Math.max(animal.kmh,.048))-Math.log10(.048))/(Math.log10(389)-Math.log10(.048))));
    const relative=Math.sqrt(Math.max(0,Math.min(1,animal.kmh/389)));
    const base=105+195*normalized;
    osc.type=animal.medio==='tierra'?'triangle':'sine';
    layer.type=animal.medio==='aire'?'triangle':animal.medio==='agua'?'sine':'sawtooth';
    osc.frequency.value=base;
    layer.frequency.value=base*(animal.medio==='aire'?1.5:animal.medio==='agua'?.5:2);
    layerGain.gain.value=animal.medio==='tierra'?.075:animal.medio==='aire'?.09:.18;
    filter.type='lowpass';
    filter.frequency.value=animal.medio==='agua'?370:animal.medio==='aire'?900:610;
    filter.Q.value=.35;
    osc.connect(filter);layer.connect(layerGain);layerGain.connect(filter);
    filter.connect(gain);
    if(pan){gain.connect(pan);pan.connect(context.destination);}else gain.connect(context.destination);
    gain.gain.value=.00001;
    osc.start();layer.start();
    introVoice={animal,context,osc,layer,gain,filter,pan,relative,beatHz:.55+2.8*relative};
  }

  function previewIntroSound(animal){
    if(!introAudio||introRunning||!animal)return;
    const context=actx();if(!context)return;
    const base=110+225*Math.max(0,Math.min(1,(Math.log10(Math.max(animal.kmh,.048))-Math.log10(.048))/(Math.log10(389)-Math.log10(.048))));
    const osc=context.createOscillator(),gain=context.createGain(),filter=context.createBiquadFilter();
    osc.type='sine';osc.frequency.value=base;
    filter.type='lowpass';filter.frequency.value=animal.medio==='agua'?380:animal.medio==='aire'?820:600;
    const now=context.currentTime;
    gain.gain.setValueAtTime(.00001,now);
    gain.gain.linearRampToValueAtTime(.010,now+.13);
    gain.gain.setValueAtTime(.010,now+.45);
    gain.gain.linearRampToValueAtTime(.00001,now+.78);
    osc.connect(filter);filter.connect(gain);gain.connect(context.destination);
    osc.start(now);osc.stop(now+.82);
  }

  function showIntroWinner(){
    const maximum=Math.max(...chartParticipants.map(d=>d.kmh));
    const winners=chartParticipants.filter(d=>d.kmh===maximum);
    const name=winners.map(d=>`${d.emoji} ${d.nombre}`).join(" y ");
    const distance=maximum*8/3.6;
    introWinner.innerHTML=`<strong>🏆 ${winners.length>1?"Empataron":"Ganó"}: ${name}</strong> · <span class="mono">${fmtSpeed(maximum)} km/h</span> · <span class="mono">${metresLabel(distance)} metros en 8 segundos</span>`;
    introWinner.hidden=false;
  }

  function introFrame(now){
    const t=Math.min((now-introStarted)/1000,graph.duration);
    setIntroTime(t);
    if(introAudio){
      const animal=selectedRanking;
      if(animal){
        if(!introVoice || introVoice.animal!==animal) startIntroVoice(animal);
        if(introVoice){
          const voice=introVoice;
          const normalized=Math.min(1,t/graph.duration);
          const relative=Math.sqrt(Math.max(animal.kmh,0)/V_MAX);
          const now=voice.context.currentTime;
          const rhythmic=Math.pow(.5+.5*Math.sin(2*Math.PI*voice.beatHz*t),3);
          const level=(.0025+.0075*rhythmic)*(.78+.22*relative);
          voice.gain.gain.setTargetAtTime(level,now,.035);
          if(voice.pan)voice.pan.pan.setTargetAtTime(-.8+1.6*normalized,now,.1);
        }

      }
    }
    if(t<graph.duration){introRAF=requestAnimationFrame(introFrame);}
    else{
      introRAF=null;
      introRunning=false;
      stopIntroVoice();
      introReplay.textContent="↻ Repetir simulación";
      showIntroWinner();
    }
  }

  function startIntro(){
    if(!chartParticipants.length){introStatus.textContent="Selecciona animales en el ranking para iniciar";return;}
    if(introRAF!==null) cancelAnimationFrame(introRAF);
    introStarted=performance.now();
    introNextTone=0;
    introWinner.hidden=true;
    introRunning=true;
    if(introAudio)startIntroVoice(selectedRanking);
    introReplay.textContent="↻ Reiniciar simulación";
    setIntroTime(0);
    introRAF=requestAnimationFrame(introFrame);
  }

  introReplay.addEventListener("click",startIntro);
  document.getElementById("intro-clear").addEventListener("click",()=>{
    chartParticipants=[];
    selectedRanking=null;
    rebuildIntro();
    render();
  });
  document.getElementById("intro-reset").addEventListener("click",()=>{
    chartParticipants=initialNames.map(name=>DATA.find(d=>d.nombre===name));
    selectedRanking=chartParticipants[0];
    rebuildIntro();
    render();
  });
  document.getElementById("intro-sound").addEventListener("click",event=>{
    introAudio=!introAudio;
    if(introAudio){actx();if(introRunning)startIntroVoice(selectedRanking);}
    else stopIntroVoice();
    introNextTone=0;
    event.currentTarget.setAttribute("aria-pressed",String(introAudio));
    event.currentTarget.textContent=introAudio?"🔊 Desactivar sonido":"🔇 Activar sonido";
  });

  chartParticipants=initialNames.map(name=>DATA.find(d=>d.nombre===name));
  selectedRanking=chartParticipants[0];
  rebuildIntro();
  render();
  displayRankingView();
  // Señal de arranque: si aparece el mensaje de fallo, el código no terminó de iniciar.
  const runtimeBanner = document.getElementById("runtime-banner");
  if (runtimeBanner) runtimeBanner.hidden = true;
  document.documentElement.setAttribute("data-app-ready", "true");
})();
