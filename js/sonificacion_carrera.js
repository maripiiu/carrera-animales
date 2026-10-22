/*
  Sonificación del duelo · V4
  Complemento autónomo: NO modifica DATA, GPS, el mapa ni los sintetizadores
  originales de velocidad.js. Se carga DESPUÉS de velocidad.js y mapa_claro.js.

  La rapidez de la persona se obtiene de la fila "Tú" en el ranking;
  la de los rivales procede de la tabla existente. Ambas son las mismas
  referencias que ya usa la página, no datos inventados por este módulo.
*/
(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const track = $("intro-svg");
  const roster = $("intro-legend");
  const controls = $("intro-replay");
  const originalSound = $("intro-sound");
  const selected = $("intro-selected");
  const timeDisplay = $("intro-time");
  const winner = $("intro-winner");
  const dataTable = $("tbody");
  const speedBars = $("bars");

  // Una integración incompleta no debe impedir que se cargue el resto de la web.
  if (!track || !roster || !controls || !originalSound || !selected ||
      !timeDisplay || !winner || !dataTable || !speedBars || $("sonic-duel")) return;

  const style = document.createElement("style");
  style.id = "sonic-duel-styles";
  style.textContent = `
    #sonic-duel{margin:18px 0 22px;padding:20px;border:1px solid #604657;border-radius:15px;
      background:linear-gradient(120deg,#29232d,#1d222c);color:#edeef2}
    #sonic-duel .sd-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
    #sonic-duel .sd-kicker{font:700 10px/1.5 'Space Mono',monospace;letter-spacing:.12em;color:#ff9cba}
    #sonic-duel h3{font-size:clamp(19px,3vw,25px);margin:4px 0 4px;line-height:1.2}
    #sonic-duel p{font-size:12px;line-height:1.55;color:#b9b8c2;margin:4px 0 10px}
    #sonic-duel .sd-source{font-size:10px;color:#bdc6d2;border:1px solid #474450;
      border-radius:20px;padding:6px 10px;white-space:normal}
    #sonic-duel .sd-switch{margin:10px 0 15px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    #sonic-duel label{font-size:12px;font-weight:700;color:#f4e6ec}
    #sonic-duel select{flex:1;min-width:180px;max-width:360px;background:#151922;color:#edeef2;
      font:inherit;font-size:13px;border:1px solid #765568;border-radius:9px;padding:10px 12px}
    #sonic-duel select:focus-visible,#sonic-duel button:focus-visible{outline:2px solid #ff9cba;outline-offset:3px}
    #sonic-duel select:disabled{opacity:.55;cursor:not-allowed}
    #sonic-duel .sd-bars{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:8px 0 13px}
    #sonic-duel .sd-participant{border:1px solid #393946;background:#161b25;border-radius:9px;padding:12px}
    #sonic-duel .sd-line{display:flex;justify-content:space-between;gap:6px;align-items:baseline;margin-bottom:9px}
    #sonic-duel .sd-line strong{font-size:12px}#sonic-duel .sd-line span{font:700 13px 'Space Mono',monospace}
    #sonic-duel .sd-bar-bg{height:12px;border-radius:7px;background:#383741;overflow:hidden}
    #sonic-duel .sd-fill{height:100%;width:0%;border-radius:7px;transition:width .1s linear}
    #sonic-duel .sd-fill.sd-me{background:#ff6d92}
    #sonic-duel .sd-fill.sd-animal{background:#aa8fe7}
    #sonic-duel .sd-unit{font-size:11px;margin-top:6px;color:#adb2bf;font-variant-numeric:tabular-nums}
    #sonic-duel .sd-result{border-radius:10px;background:rgba(255,109,146,.085);
      border:1px solid rgba(255,109,146,.2);padding:12px 14px;font-size:13px;line-height:1.5}
    #sonic-duel .sd-result strong{color:#fff}
    #sonic-duel .sd-help{margin:12px 0 0;display:flex;align-items:center;flex-wrap:wrap;gap:10px}
    #sonic-duel .sd-help span{color:#aeb5c5;font-size:11px;flex:1;min-width:190px}
    #sonic-duel .sd-test{background:#32313d;border:1px solid #71616f;color:#f9eef1;
      border-radius:9px;padding:9px 12px;font:700 11px 'Archivo',sans-serif;cursor:pointer}
    #sonic-duel .sd-test:hover{background:#454050}
    #sonic-duel .sd-test:disabled{opacity:.6;cursor:not-allowed}
    @media(max-width:640px){#sonic-duel{padding:15px}#sonic-duel .sd-bars{grid-template-columns:1fr}
      #sonic-duel .sd-switch{align-items:stretch;flex-direction:column}
      #sonic-duel select{width:100%;max-width:none}}
    @media(prefers-reduced-motion:reduce){#sonic-duel .sd-fill{transition:none}}
  `;
  document.head.appendChild(style);

  const panel = document.createElement("section");
  panel.id = "sonic-duel";
  panel.setAttribute("aria-label", "Duelo con señales sonoras de ventaja");
  panel.innerHTML = `
    <div class="sd-top">
      <div><span class="sd-kicker">SONIFICACIÓN · DIFERENCIA DE DISTANCIA</span>
        <h3>¿Quién va ganando tu duelo?</h3>
        <p>Dos referencias de rapidez: máxima GPS filtrada (o demo) y máxima animal aproximada, proyectadas durante ocho segundos. La alerta indica 10 m de ventaja en esta simulación, no en una carrera real.</p></div>
      <span class="sd-source" id="sd-source">Resultado personal pendiente</span>
    </div>
    <div class="sd-switch">
      <label for="sd-rival">Tu rival de La pista</label>
      <select id="sd-rival" disabled><option value="">Completa una prueba para competir</option></select>
    </div>
    <div class="sd-bars">
      <div class="sd-participant">
        <div class="sd-line"><strong>🏃 Tú</strong><span id="sd-me-speed">— km/h</span></div>
        <div class="sd-bar-bg"><div id="sd-me-fill" class="sd-fill sd-me"></div></div>
        <div class="sd-unit" id="sd-me-distance">0,0 m en 0,0 s</div>
      </div>
      <div class="sd-participant">
        <div class="sd-line"><strong id="sd-rival-name">🐾 Rival</strong><span id="sd-rival-speed">— km/h</span></div>
        <div class="sd-bar-bg"><div id="sd-rival-fill" class="sd-fill sd-animal"></div></div>
        <div class="sd-unit" id="sd-rival-distance">0,0 m en 0,0 s</div>
      </div>
    </div>
    <div class="sd-result" id="sd-message" role="status" aria-live="polite">
      Primero registra una rapidez con GPS o con un modo demo para que aparezca «Tú» en La pista.
    </div>
    <div class="sd-help"><span>🔉 Alertas breves, no beats superpuestos. Activa el sonido de La pista para oírlas.</span>
      <button class="sd-test" id="sd-test" type="button">▶ Probar las dos alertas</button></div>
  `;
  // Después del participante seleccionado y antes de los botones de simulación.
  selected.insertAdjacentElement("afterend", panel);

  const ui = {
    rival: $("sd-rival"), source: $("sd-source"),
    meSpeed: $("sd-me-speed"), rivalSpeed: $("sd-rival-speed"),
    rivalName: $("sd-rival-name"), meFill: $("sd-me-fill"),
    rivalFill: $("sd-rival-fill"), meDistance: $("sd-me-distance"),
    rivalDistance: $("sd-rival-distance"), message: $("sd-message"), test: $("sd-test")
  };

  const nf = (v, decimals = 1) => Number(v).toLocaleString("es-CL", {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals
  });
  function parseSpeed(s) {
    const value = String(s ?? "").trim().replace(/[^0-9,.-]/g, "");
    return Number(value.includes(",") ? value.replace(/\./g, "").replace(",", ".") : value);
  }
  const formatSpeed = speed => (speed < 1 ? nf(speed, 3) : nf(speed, speed % 1 === 0 ? 0 : 1)) + " km/h";
  const nameFromLabel = text => {
    const label = text.trim(), at = label.indexOf(" ");
    return at < 0 ? label : label.slice(at + 1).trim();
  };
  const timeNow = () => parseSpeed(timeDisplay.textContent || "0");
  const soundEnabled = () => originalSound.getAttribute("aria-pressed") === "true";
  const meters = (kmh, seconds) => kmh * seconds / 3.6;

  const speeds = new Map();
  function collectSpeeds() {
    dataTable.querySelectorAll("tr").forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 4) return;
      const name = nameFromLabel(cells[0].textContent);
      const speed = parseSpeed(cells[3].textContent);
      if (name && Number.isFinite(speed)) speeds.set(name, speed);
    });
  }
  function mySpeed() {
    // Es el resultado guardado en el ranking, NO el slider hipotético.
    const row = [...speedBars.querySelectorAll("button.row[aria-label]")]
      .find(node => /^Tú,/.test(node.getAttribute("aria-label") || ""));
    const value = row?.querySelector(".vl")?.textContent;
    const speed = value === undefined ? NaN : parseSpeed(value);
    return Number.isFinite(speed) ? speed : null;
  }
  function rivalsInTrack() {
    collectSpeeds();
    return [...roster.querySelectorAll("button.intro-chip")].map(chip => {
      const label = chip.textContent.trim();
      const name = nameFromLabel(label);
      return {name, label, chip, kmh: speeds.get(name)};
    }).filter(d => d.name !== "Tú" && Number.isFinite(d.kmh));
  }

  let typeOfResult = "";
  let currentRivals = [];
  let active = false;
  let raf = null;
  let alreadyWarned = false;
  let alreadyFinished = false;
  let lastDisplayT = -1;
  let audioContext = null;
  let audioAvailable = true;

  function sourceType() {
    return typeOfResult === "gps" ? "Máxima GPS observada y filtrada · comparación aproximada"
      : typeOfResult === "demo" ? "Demostración · no es rapidez real"
      : "Rapidez guardada en La pista";
  }
  function rememberSource() {
    const txt = selected.textContent || "";
    if (!txt.includes("Tú")) return;
    if (txt.includes("máxima GPS filtrada") || txt.includes("estimado por GPS")) typeOfResult = "gps";
    else if (txt.includes("simulada")) typeOfResult = "demo";
  }

  function getRival() {
    return currentRivals.find(d => d.name === ui.rival.value) || null;
  }
  function setStatus(text) {
    if (ui.message.textContent !== text) ui.message.textContent = text;
  }
  function resetRace() {
    active = false;
    alreadyWarned = false;
    alreadyFinished = false;
    lastDisplayT = -1;
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
  }

  function refreshRivals() {
    const previous = ui.rival.value;
    const mine = mySpeed();
    currentRivals = rivalsInTrack();
    rememberSource();
    const canDuel = mine !== null && roster.textContent.includes("Tú") && currentRivals.length > 0;
    ui.rival.replaceChildren();
    if (!canDuel) {
      const option = new Option("Completa una prueba y añade un rival", "");
      ui.rival.add(option);
      ui.rival.disabled = true;
      ui.source.textContent = mine === null ? "Resultado personal pendiente" : sourceType();
      ui.meSpeed.textContent = mine === null ? "— km/h" : formatSpeed(mine);
      ui.rivalSpeed.textContent = "— km/h";
      ui.rivalName.textContent = "🐾 Rival";
      ui.meFill.style.width = "0%";
      ui.rivalFill.style.width = "0%";
      ui.meDistance.textContent = "0,0 m en 0,0 s";
      ui.rivalDistance.textContent = "0,0 m en 0,0 s";
      setStatus(mine === null
        ? "Primero registra una rapidez con GPS o con un modo demo para que aparezca «Tú» en La pista."
        : "Para iniciar un duelo, añade al menos un animal desde el mapa o las barras.");
      return;
    }
    ui.rival.disabled = false;
    currentRivals.forEach(d => ui.rival.add(new Option(`${d.label} · ${formatSpeed(d.kmh)}`, d.name)));
    const nearest = [...currentRivals].sort((a,b) =>
      Math.abs(a.kmh-mine)-Math.abs(b.kmh-mine))[0];
    ui.rival.value = currentRivals.some(d => d.name === previous) ? previous : nearest.name;
    ui.source.textContent = sourceType();
    ui.meSpeed.textContent = formatSpeed(mine);
    ui.rivalSpeed.textContent = formatSpeed(getRival().kmh);
    ui.rivalName.textContent = getRival().label;
    updateBars(0, mine, getRival());
    if (!active) setStatus("Selecciona tu rival y pulsa «Iniciar simulación». El sonido avisará cuando alguien consiga 10 m de ventaja.");
  }

  function updateBars(t, mine, rival) {
    if (mine === null || !rival) return;
    const maxDistance = Math.max(meters(mine, 8), meters(rival.kmh, 8), .01);
    const myDist = meters(mine,t), animalDist = meters(rival.kmh,t);
    ui.meSpeed.textContent = formatSpeed(mine);
    ui.rivalSpeed.textContent = formatSpeed(rival.kmh);
    ui.rivalName.textContent = rival.label;
    ui.meFill.style.width = Math.min(100,myDist/maxDistance*100).toFixed(2) + "%";
    ui.rivalFill.style.width = Math.min(100,animalDist/maxDistance*100).toFixed(2) + "%";
    ui.meDistance.textContent = `${nf(myDist)} m en ${nf(t)} s`;
    ui.rivalDistance.textContent = `${nf(animalDist)} m en ${nf(t)} s`;
  }

  function ensureAudio() {
    if (!audioAvailable) return null;
    if (audioContext) {
      if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
      return audioContext;
    }
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) {
      audioAvailable = false;
      return null;
    }
    try {
      audioContext = new Audio();
      if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
      return audioContext;
    } catch (_) {
      audioAvailable = false;
      return null;
    }
  }
  function note(ctx, freq, start, dur=.11, volume=.085) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume,start+.018);
    gain.gain.exponentialRampToValueAtTime(.0001,start+dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start+dur+.025);
  }
  function cue(who, when=0, soft=false) {
    if (!soundEnabled()) return;
    const ctx = ensureAudio();
    if (!ctx || ctx.state === "suspended") return;
    const tones = who === "animal" ? [520,390,280]
      : who === "me" ? [340,465,610] : [410,410];
    const start = ctx.currentTime + when;
    tones.forEach((f,i) => note(ctx,f,start+i*.15,.12,soft?.035:.075));
  }
  function conclude(mine, rival) {
    if (alreadyFinished) return;
    alreadyFinished = true;
    const gap = meters(mine,8)-meters(rival.kmh,8);
    const diff = nf(Math.abs(gap));
    if (Math.abs(gap) < .05) {
      setStatus(`🤝 Empate con ${rival.name}: ambos recorrerían aproximadamente lo mismo en 8 segundos.`);
      cue("tie",0,true);
    } else if (gap > 0) {
      setStatus(`🏁 Tu rapidez es mayor que la de ${rival.name}. En 8 segundos recorrerías ${diff} m más.`);
      cue("me",0,true);
    } else {
      setStatus(`🏁 ${rival.name} es más rápido que tú. En 8 segundos recorrería ${diff} m más.`);
      cue("animal",0,true);
    }
    active = false;
  }
  function frame() {
    if (!active) return;
    const mine = mySpeed(), rival = getRival();
    if (mine === null || !rival || !roster.textContent.includes("Tú")) {
      resetRace();
      return;
    }
    const t = Math.max(0,Math.min(8,timeNow()));
    if (t !== lastDisplayT) {
      lastDisplayT = t;
      updateBars(t,mine,rival);
    }
    const gap = meters(mine,t)-meters(rival.kmh,t);
    if (!alreadyWarned && Math.abs(gap) >= 10) {
      alreadyWarned = true;
      if (gap > 0) {
        setStatus(`🔔 ¡Llevas ${nf(Math.abs(gap))} m de ventaja frente a ${rival.name}!`);
        cue("me");
      } else {
        setStatus(`🔔 ¡${rival.name} te lleva ${nf(Math.abs(gap))} m de ventaja!`);
        cue("animal");
      }
    }
    if (t >= 8 || (!winner.hidden && t > 0)) {
      updateBars(8,mine,rival);
      conclude(mine,rival);
      raf = null;
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  // Mantener la información al día sin tocar estados privados de velocidad.js.
  const observer = new MutationObserver(() => {
    if (active) resetRace();
    refreshRivals();
  });
  observer.observe(roster,{childList:true});
  const sourceObserver = new MutationObserver(rememberSource);
  sourceObserver.observe(selected,{childList:true,subtree:true,characterData:true});

  ui.rival.addEventListener("change", () => {
    if (!active) alreadyWarned = false; // máximo una alerta de ventaja por carrera
    const rival = getRival();
    if (!rival) return;
    const t = active ? timeNow() : 0;
    updateBars(t,mySpeed(),rival);
    if (!active) setStatus(`Seleccionaste a ${rival.name}. Inicia la pista para comparar las distancias.`);
    // Selecciona el mismo animal en La pista: el tono original representa ese rival.
    rival.chip.click();
  });
  controls.addEventListener("click", () => {
    resetRace();
    refreshRivals();
    const mine = mySpeed(), rival = getRival();
    if (mine === null || !rival) return; // modo animales: conserva el comportamiento original
    // El código base ya inició la simulación cuando llega este listener.
    // El sonido original debe corresponder al rival que queremos comparar.
    rival.chip.click();
    updateBars(0,mine,rival);
    setStatus(`🏃 Corriendo contra ${rival.name}. Escucha la alerta cuando la diferencia llegue a 10 m.`);
    alreadyWarned = false;
    alreadyFinished = false;
    active = true;
    raf = requestAnimationFrame(frame);
  });
  ["intro-reset","intro-clear"].forEach(id => $(id)?.addEventListener("click", () => {
    resetRace();
    // El código original reconstruye primero el roster y el observer actualiza la UI.
  }));
  // Si el sonido se apaga, ninguna alerta nueva debe reproducirse.
  originalSound.addEventListener("click", () => {
    if (soundEnabled()) ensureAudio(); // desbloqueo dentro del gesto real; importante en Safari
    ui.test.textContent = soundEnabled() ? "▶ Probar las dos alertas" : "🔇 Activar sonido para probar";
  });
  ui.test.addEventListener("click", () => {
    // Activación voluntaria: desbloquea AudioContext en navegadores móviles.
    if (!soundEnabled()) originalSound.click();
    const ctx = ensureAudio();
    if (!ctx) {
      setStatus("Este navegador no permite sintetizar audio. La comparación visual sigue disponible.");
      return;
    }
    if (ctx.state === "suspended") {
      ctx.resume().then(() => {cue("animal");cue("me",.7);}).catch(() => {});
    } else {
      cue("animal"); cue("me",.7);
    }
    if (!active) setStatus("Prueba de sonido: primero alerta del animal (tono descendente); después alerta a tu favor (tono ascendente).");
  });

  // mapa_claro.js ya reutiliza el valor principal calculado en velocidad.js.
  // Actualizamos solo los rótulos que aún describían la antigua media GPS.
  const mapMetricSource = document.getElementById("mcl-source");
  if (mapMetricSource) {
    const clarifyMapSource = () => {
      const before = mapMetricSource.textContent || "";
      if (before.includes("GPS: rapidez media estimada")) {
        mapMetricSource.textContent = "GPS: máxima observada y filtrada. Se compara con máximos animales aproximados; condiciones diferentes.";
      }
    };
    const mapMetricObserver = new MutationObserver(clarifyMapSource);
    mapMetricObserver.observe(mapMetricSource,{childList:true,subtree:true,characterData:true});
    clarifyMapSource();
  }
  const mapMethod = document.querySelector(".mcl-method");
  if (mapMethod) mapMethod.textContent = (mapMethod.textContent || "").replace(
    "La rapidez media GPS no es equivalente a una velocidad máxima animal.",
    "La máxima observada por GPS y la máxima animal son aproximaciones obtenidas en condiciones distintas.");

  refreshRivals();
})();
