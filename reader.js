/* Reader — loads a tale by slug via URL param and renders it.
   Supports per-language scene text, an age-aware complexity slider, and
   text-to-speech reading via the Web Speech API. */

(function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('tale');
  const twistParam = params.get('twist'); // optional preselection

  // i18n helpers (fall back if common.js isn't ready)
  const t = (key, fallback) =>
    (window.ContesI18N && window.ContesI18N.t && window.ContesI18N.t(key)) ||
    fallback ||
    key;
  const currentLang = () =>
    (window.ContesI18N && window.ContesI18N.lang && window.ContesI18N.lang()) || 'ca';

  if (!slug) {
    document.querySelector('.reader').innerHTML =
      '<div class="config-panel"><h2>' + t('not_found_title', "No s'ha trobat el conte") + '</h2>' +
      '<p>' + t('not_found_body', 'Torna a la biblioteca i tria un conte.') + ' <a href="index.html">index.html</a></p></div>';
    return;
  }

  // Load the tale's data.js dynamically — this works on file:// (no fetch needed).
  const script = document.createElement('script');
  script.src = `contes/${slug}/data.js`;
  script.onload = init;
  script.onerror = () => {
    document.querySelector('.reader').innerHTML =
      '<div class="config-panel"><h2>' + t('not_available_title', 'Conte no disponible') + '</h2>' +
      '<p>' + t('not_available_body', "No s'ha pogut carregar el conte.") + ' <a href="index.html">index.html</a></p></div>';
  };
  document.body.appendChild(script);

  function init() {
    const tale = window.CURRENT_TALE;
    if (!tale) return;

    // ---- Per-language value picker ----
    function pickLang(val) {
      if (val == null) return '';
      if (typeof val === 'string') return val;
      const lang = currentLang();
      return val[lang] || val.ca || val.en || Object.values(val)[0] || '';
    }

    // ---- Age-aware text adapter ----
    // Strategy: at low ages keep only the leading sentence (the headline of
    // each scene). At medium ages show the full text. At higher ages show
    // the full text plus a vocabulary appendix listing every <<highlighted>>
    // word in the scene so older kids see them grouped together.
    function ageBand(age) {
      if (age <= 5) return 'young';
      if (age >= 9) return 'old';
      return 'mid';
    }
    function firstSentence(s) {
      // Find the first sentence boundary while ignoring abbreviations like "Sr."
      const m = s.match(/^[\s\S]*?[\.!?](?:\s|$)/);
      return (m ? m[0] : s).trim();
    }
    function adaptText(rawText, age) {
      const band = ageBand(age);
      if (band === 'young') return firstSentence(rawText);
      return rawText; // mid + old keep the full sentence; old gets a vocab pill row added later
    }

    // ---- Render-text formatting ----
    // Replace {key} with styled name spans, and <<word>> with .hl spans.
    function formatText(text, names) {
      let out = text;
      out = out.replace(/\{([a-zA-Z0-9_]+)\}/g, (m, key) => {
        if (names[key]) return `<span class="name">${escapeHtml(names[key])}</span>`;
        return m;
      });
      out = out.replace(/<<([^>]+)>>/g, (_, txt) => `<span class="hl">${txt}</span>`);
      return out;
    }
    // Plain-text version for the speech synthesizer (strips markup tokens).
    function plainText(text, names) {
      let out = text;
      out = out.replace(/\{([a-zA-Z0-9_]+)\}/g, (m, key) => names[key] || m);
      out = out.replace(/<<([^>]+)>>/g, (_, txt) => txt);
      return out;
    }
    // Pull every <<highlighted>> word out, in order, deduped.
    function extractHighlights(text) {
      const out = [];
      const seen = new Set();
      const re = /<<([^>]+)>>/g;
      let m;
      while ((m = re.exec(text))) {
        const w = m[1].trim();
        if (!seen.has(w.toLowerCase())) {
          seen.add(w.toLowerCase());
          out.push(w);
        }
      }
      return out;
    }
    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
      }[c]));
    }

    // ---- Header label & document title ----
    const taleLabel = document.getElementById('tale-label');
    taleLabel.removeAttribute('data-i18n');
    function setTitleAndLabel() {
      const title = pickLang(tale.title);
      document.title = title + ' — Contes interactius';
      taleLabel.textContent = t('label_tale', '📖 Conte') + ' · ' + title;
    }
    setTitleAndLabel();

    // ---- Character fields ----
    const charactersDiv = document.getElementById('character-fields');
    const charInputs = {};
    const charLabelEls = {};
    function renderCharFields() {
      charactersDiv.innerHTML = '';
      Object.entries(tale.characters).forEach(([key, meta]) => {
        const field = document.createElement('div');
        field.className = 'field';
        const labelText = pickLang(meta.label);
        field.innerHTML = `
          <label>${escapeHtml(labelText)}</label>
          <input type="text" data-key="${key}" value="${escapeHtml(meta.default)}" placeholder="${escapeHtml(meta.default)}" />
        `;
        charactersDiv.appendChild(field);
        charInputs[key] = field.querySelector('input');
        charLabelEls[key] = field.querySelector('label');
      });
    }
    renderCharFields();
    function updateCharLabelsForLang() {
      Object.entries(tale.characters).forEach(([key, meta]) => {
        if (charLabelEls[key]) charLabelEls[key].textContent = pickLang(meta.label);
      });
    }

    // ---- Twist chips ----
    const twistBtns = document.querySelectorAll('.twist-chip');
    let currentTwist = null;
    const availableTwists = Object.keys(tale.variants);
    twistBtns.forEach((btn) => {
      const twist = btn.dataset.twist;
      if (!availableTwists.includes(twist)) {
        btn.disabled = true;
        btn.style.opacity = '0.35';
        btn.style.cursor = 'not-allowed';
        btn.title = 'No disponible per a aquest conte';
      }
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        twistBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentTwist = twist;
      });
    });
    const defaultTwist =
      (twistParam && availableTwists.includes(twistParam) && twistParam) ||
      availableTwists[0];
    document
      .querySelector(`.twist-chip[data-twist="${defaultTwist}"]`)
      .classList.add('active');
    currentTwist = defaultTwist;

    // ---- Age slider ----
    const AGE_KEY = 'contes-age';
    const ageSlider = document.getElementById('age-slider');
    const ageValueEl = document.getElementById('age-value');
    const ageBandEl = document.getElementById('age-band');
    let currentAge = parseInt(localStorage.getItem(AGE_KEY) || '7', 10);
    if (!Number.isFinite(currentAge) || currentAge < 3 || currentAge > 12) currentAge = 7;
    ageSlider.value = String(currentAge);
    function updateAgeUI() {
      ageValueEl.textContent = String(currentAge);
      const band = ageBand(currentAge);
      const key = band === 'young' ? 'age_band_young' : (band === 'old' ? 'age_band_old' : 'age_band_mid');
      const dflt = band === 'young' ? '(Petits)' : (band === 'old' ? '(Grans)' : '(Mitjans)');
      ageBandEl.textContent = t(key, dflt);
      ageBandEl.setAttribute('data-i18n', key);
    }
    updateAgeUI();
    ageSlider.addEventListener('input', () => {
      currentAge = parseInt(ageSlider.value, 10);
      localStorage.setItem(AGE_KEY, String(currentAge));
      updateAgeUI();
      // If the story is already showing, re-render scenes so age changes take effect immediately.
      if (storyIsVisible) {
        stopAudio();
        renderScenes();
      }
    });

    // ---- Buttons ----
    document.getElementById('start-btn').addEventListener('click', renderStory);
    document.getElementById('reset-btn').addEventListener('click', () => {
      Object.entries(tale.characters).forEach(([key, meta]) => {
        charInputs[key].value = meta.default;
      });
    });
    document.getElementById('reconfigure-btn').addEventListener('click', () => {
      stopAudio();
      document.getElementById('config-panel').style.display = 'block';
      document.getElementById('story-title').style.display = 'none';
      document.getElementById('story-toolbar').style.display = 'none';
      document.getElementById('scenes').innerHTML = '';
      document.getElementById('post-actions').style.display = 'none';
      storyIsVisible = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function getNames() {
      const names = {};
      Object.keys(tale.characters).forEach((k) => {
        const v = charInputs[k].value.trim();
        names[k] = v.length ? v : tale.characters[k].default;
      });
      return names;
    }

    // ---- Story rendering ----
    let storyIsVisible = false;
    function renderStory() {
      stopAudio();
      const titleEl = document.getElementById('story-title');
      titleEl.textContent = pickLang(tale.title);
      titleEl.style.display = 'block';
      document.getElementById('story-toolbar').style.display = audioSupported ? 'flex' : 'none';
      renderScenes();
      document.getElementById('config-panel').style.display = 'none';
      document.getElementById('post-actions').style.display = 'flex';
      storyIsVisible = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function renderScenes() {
      const names = getNames();
      const variant = tale.variants[currentTwist];
      if (!variant) return;
      const band = ageBand(currentAge);
      const scenesEl = document.getElementById('scenes');
      scenesEl.innerHTML = '';

      variant.scenes.forEach((scene, idx) => {
        const sceneDiv = document.createElement('div');
        sceneDiv.className = 'scene';
        sceneDiv.dataset.idx = String(idx);

        // Per-scene play button (top-right)
        if (audioSupported) {
          const playBtn = document.createElement('button');
          playBtn.className = 'scene-play';
          playBtn.dataset.idx = String(idx);
          playBtn.innerHTML = `<span>🔊</span><span>${escapeHtml(t('play_scene', '🔊 Escolta').replace(/^🔊\s*/, ''))}</span>`;
          playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentlyPlayingIdx === idx) {
              stopAudio();
            } else {
              playScene(idx);
            }
          });
          sceneDiv.appendChild(playBtn);
        }

        const img = document.createElement('div');
        img.className = 'scene-image';
        img.innerHTML = `<img src="contes/${slug}/${scene.image}" alt="" />`;

        const text = document.createElement('div');
        text.className = 'scene-text';
        if (band === 'young') text.classList.add('age-young');
        if (band === 'old') text.classList.add('age-old');
        const raw = pickLang(scene.text);
        const adapted = adaptText(raw, currentAge);
        text.innerHTML = formatText(adapted, names);

        // For older kids, append a vocabulary section listing all the
        // educational highlights in this scene.
        if (band === 'old') {
          const highlights = extractHighlights(raw);
          if (highlights.length) {
            const vocab = document.createElement('div');
            vocab.className = 'vocab-section';
            const lbl = document.createElement('span');
            lbl.className = 'vocab-label';
            lbl.setAttribute('data-i18n', 'vocab_label');
            lbl.textContent = t('vocab_label', 'Aprenem:');
            vocab.appendChild(lbl);
            highlights.forEach((w) => {
              const pill = document.createElement('span');
              pill.className = 'vocab-pill';
              pill.textContent = w;
              vocab.appendChild(pill);
            });
            text.appendChild(vocab);
          }
        }

        sceneDiv.appendChild(img);
        sceneDiv.appendChild(text);
        scenesEl.appendChild(sceneDiv);
      });
    }

    // ---- Audio reader (Web Speech API) ----
    const audioSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
      && typeof window.SpeechSynthesisUtterance === 'function';
    const playAllBtn = document.getElementById('play-all-btn');
    const stopBtn = document.getElementById('stop-btn');
    const audioStatus = document.getElementById('audio-status');
    let currentlyPlayingIdx = -1; // -1 = nothing playing
    let queue = []; // remaining scene indices to play (when in "play all" mode)
    let allMode = false;
    let currentUtter = null;

    if (!audioSupported) {
      // Hide toolbar entirely if not supported.
      const tb = document.getElementById('story-toolbar');
      if (tb) tb.style.display = 'none';
    } else {
      playAllBtn.addEventListener('click', () => {
        if (allMode) { stopAudio(); return; }
        playFromIndex(0);
      });
      stopBtn.addEventListener('click', stopAudio);
    }

    function langCodeForVoice() {
      const map = { ca: 'ca-ES', en: 'en-US', es: 'es-ES', fr: 'fr-FR' };
      return map[currentLang()] || 'en-US';
    }
    function pickVoice(langCode) {
      const voices = window.speechSynthesis.getVoices() || [];
      // Prefer exact match, then language prefix match, then any
      const prefix = langCode.split('-')[0];
      let v = voices.find((vv) => vv.lang === langCode);
      if (!v) v = voices.find((vv) => vv.lang && vv.lang.toLowerCase().startsWith(prefix));
      return v || null;
    }
    function speakSceneAt(idx, onEnd) {
      const variant = tale.variants[currentTwist];
      const scene = variant && variant.scenes[idx];
      if (!scene) { onEnd && onEnd(); return; }
      const names = getNames();
      const raw = pickLang(scene.text);
      const adapted = adaptText(raw, currentAge);
      const txt = plainText(adapted, names);
      const utter = new SpeechSynthesisUtterance(txt);
      const langCode = langCodeForVoice();
      utter.lang = langCode;
      const voice = pickVoice(langCode);
      if (voice) utter.voice = voice;
      utter.rate = currentAge <= 5 ? 0.9 : 1.0;
      utter.pitch = 1.05;
      currentUtter = utter;

      utter.onstart = () => {
        currentlyPlayingIdx = idx;
        markScenePlaying(idx);
        // Scroll the playing scene into view if we're in "play all" mode
        if (allMode) {
          const el = document.querySelector(`.scene[data-idx="${idx}"]`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (audioStatus) audioStatus.textContent = `${idx + 1} / ${variant.scenes.length}`;
      };
      utter.onend = () => {
        if (currentUtter !== utter) return; // a stop happened
        currentlyPlayingIdx = -1;
        markScenePlaying(-1);
        onEnd && onEnd();
      };
      utter.onerror = () => {
        currentlyPlayingIdx = -1;
        markScenePlaying(-1);
        onEnd && onEnd();
      };
      window.speechSynthesis.speak(utter);
    }
    function markScenePlaying(idx) {
      document.querySelectorAll('.scene').forEach((el) => {
        el.classList.toggle('playing', Number(el.dataset.idx) === idx);
      });
      document.querySelectorAll('.scene-play').forEach((el) => {
        const isThis = Number(el.dataset.idx) === idx;
        el.classList.toggle('playing', isThis);
        const labelKey = isThis ? 'playing_scene' : 'play_scene';
        const labelDflt = isThis ? '⏸ Llegint…' : '🔊 Escolta';
        // Just update the second span (text portion); keep the icon span stable
        const labelTextOnly = t(labelKey, labelDflt).replace(/^[^\s]+\s*/, '');
        const iconOnly = isThis ? '⏸' : '🔊';
        el.innerHTML = `<span>${iconOnly}</span><span>${escapeHtml(labelTextOnly)}</span>`;
      });
      if (stopBtn) stopBtn.disabled = idx === -1 && !allMode;
    }
    function playScene(idx) {
      stopAudio(); // cancel anything currently in flight
      allMode = false;
      currentlyPlayingIdx = idx;
      speakSceneAt(idx, () => { /* single scene, nothing more */ });
    }
    function playFromIndex(startIdx) {
      stopAudio();
      const variant = tale.variants[currentTwist];
      if (!variant) return;
      allMode = true;
      stopBtn.disabled = false;
      playAllBtn.classList.add('playing');
      // Play sequentially
      let i = startIdx;
      const playNext = () => {
        if (!allMode) return; // stopped
        if (i >= variant.scenes.length) {
          allMode = false;
          playAllBtn.classList.remove('playing');
          stopBtn.disabled = true;
          markScenePlaying(-1);
          if (audioStatus) audioStatus.textContent = '';
          return;
        }
        speakSceneAt(i, () => {
          i += 1;
          // Tiny pause between scenes so it doesn't feel rushed
          setTimeout(playNext, 250);
        });
      };
      playNext();
    }
    function stopAudio() {
      if (!audioSupported) return;
      try { window.speechSynthesis.cancel(); } catch (_) {}
      currentUtter = null;
      currentlyPlayingIdx = -1;
      allMode = false;
      if (playAllBtn) playAllBtn.classList.remove('playing');
      if (stopBtn) stopBtn.disabled = true;
      if (audioStatus) audioStatus.textContent = '';
      markScenePlaying(-1);
    }
    // Speech voices load asynchronously — refresh once when they arrive.
    if (audioSupported && typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = () => { /* voice list now populated */ };
    }
    // Stop any audio when the page is hidden or unloaded.
    window.addEventListener('beforeunload', stopAudio);

    // ---- Live re-render on language change ----
    window.addEventListener('contes-lang-change', () => {
      stopAudio();
      setTitleAndLabel();
      updateCharLabelsForLang();
      updateAgeUI();
      // Re-translate the play-all button label & stop label & status
      const playAllSpan = playAllBtn && playAllBtn.querySelector('[data-i18n]');
      // (these elements already have data-i18n="play_all" / "stop_audio", common.js retranslates them)
      if (storyIsVisible) {
        const titleEl = document.getElementById('story-title');
        titleEl.textContent = pickLang(tale.title);
        renderScenes();
      }
    });
  }
})();
