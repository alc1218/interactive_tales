/* ================================================================
   Shared theme toggle, language dropdown, and i18n for Contes.
   Used by both index.html and reader.html.
   ================================================================ */

(function () {
  // ---------- Flag SVGs ----------
  const FLAGS = {
    en: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" width="16" height="10" style="vertical-align:middle;border-radius:2px;"><rect width="5" height="3" fill="#012169"/><line x1="0" y1="0" x2="5" y2="3" stroke="#fff" stroke-width=".6"/><line x1="5" y1="0" x2="0" y2="3" stroke="#fff" stroke-width=".6"/><line x1="0" y1="0" x2="5" y2="3" stroke="#C8102E" stroke-width=".3"/><line x1="5" y1="0" x2="0" y2="3" stroke="#C8102E" stroke-width=".3"/><rect x="2" y="0" width="1" height="3" fill="#fff"/><rect x="0" y="1" width="5" height="1" fill="#fff"/><rect x="2.2" y="0" width=".6" height="3" fill="#C8102E"/><rect x="0" y="1.2" width="5" height=".6" fill="#C8102E"/></svg>',
    es: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" width="16" height="10" style="vertical-align:middle;border-radius:2px;"><rect width="5" height="3" fill="#AA151B"/><rect y=".75" width="5" height="1.5" fill="#F1BF00"/></svg>',
    ca: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" width="16" height="10" style="vertical-align:middle;border-radius:2px;"><rect width="5" height="3" fill="#FCDD09"/><rect y=".375" width="5" height=".375" fill="#DA121A"/><rect y="1.125" width="5" height=".375" fill="#DA121A"/><rect y="1.875" width="5" height=".375" fill="#DA121A"/><rect y="2.625" width="5" height=".375" fill="#DA121A"/></svg>',
    fr: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" width="16" height="10" style="vertical-align:middle;border-radius:2px;"><rect width="5" height="3" fill="#002395"/><rect x="1.667" width="1.666" height="3" fill="#fff"/><rect x="3.333" width="1.667" height="3" fill="#ED2939"/></svg>'
  };

  // ---------- UI translations ----------
  const I18N = {
    en: {
      created_by: "Created by",
      toggle_theme: "Toggle theme",
      site_title: "Interactive tales",
      site_subtitle: "Pick a tale, choose the names, and learn while you read.",
      library_footer: "8 classic tales · Content and images inside each tale folder.",
      back: "← Back to library",
      label_tale: "📖 Tale",
      personalize: "Personalize your tale",
      educational_theme: "Educational theme",
      twist_numbers: "🔢 Numbers",
      twist_colors:  "🎨 Colors",
      twist_shapes:  "🔺 Shapes",
      twist_objects: "🧺 Objects",
      btn_start: "▶ Start the tale",
      btn_reset: "↺ Reset names",
      btn_reconfigure: "⚙ Edit again",
      btn_another: "📚 Pick another tale",
      footer_reader: "Made with ♥ for reading together.",
      not_found_title: "Tale not found",
      not_found_body: "Go back to the library and choose a tale.",
      not_available_title: "Tale not available",
      not_available_body: "The tale could not be loaded.",
      tag_n: "Numbers", tag_c: "Colors", tag_s: "Shapes", tag_o: "Objects",
      age_label: "Reader age",
      age_years: "years",
      age_band_young: "(Young)",
      age_band_mid: "(Middle)",
      age_band_old: "(Older)",
      play_all: "Read whole tale",
      stop_audio: "Stop",
      play_scene: "🔊 Listen",
      playing_scene: "⏸ Playing…",
      vocab_label: "We learn:",
      audio_unsupported: "Audio reader not supported in this browser.",
      audio_no_voice: "No voice available for this language.",
      title_tres_porquets: "The Three Little Pigs",
      title_caputxeta_vermella: "Little Red Riding Hood",
      title_gegant_del_pi: "The Giant of the Pine",
      title_rateta: "The Little Mouse Who Swept the Stairs",
      title_patufet: "Little Thumb (Patufet)",
      title_ventafocs: "Cinderella",
      title_llebre_i_tortuga: "The Hare and the Tortoise",
      title_aneguet_lleig: "The Ugly Duckling"
    },
    es: {
      created_by: "Creado por",
      toggle_theme: "Cambiar tema",
      site_title: "Cuentos interactivos",
      site_subtitle: "Elige un cuento, pon los nombres y aprende mientras lees.",
      library_footer: "8 cuentos clásicos · Contenido e imágenes dentro de cada carpeta.",
      back: "← Volver a la biblioteca",
      label_tale: "📖 Cuento",
      personalize: "Personaliza tu cuento",
      educational_theme: "Tema educativo",
      twist_numbers: "🔢 Números",
      twist_colors:  "🎨 Colores",
      twist_shapes:  "🔺 Formas",
      twist_objects: "🧺 Objetos",
      btn_start: "▶ Empieza el cuento",
      btn_reset: "↺ Restaurar nombres",
      btn_reconfigure: "⚙ Editar de nuevo",
      btn_another: "📚 Elegir otro cuento",
      footer_reader: "Hecho con ♥ para leer juntos.",
      not_found_title: "Cuento no encontrado",
      not_found_body: "Vuelve a la biblioteca y elige un cuento.",
      not_available_title: "Cuento no disponible",
      not_available_body: "No se ha podido cargar el cuento.",
      tag_n: "Números", tag_c: "Colores", tag_s: "Formas", tag_o: "Objetos",
      age_label: "Edad del lector",
      age_years: "años",
      age_band_young: "(Pequeños)",
      age_band_mid: "(Medianos)",
      age_band_old: "(Mayores)",
      play_all: "Leer cuento entero",
      stop_audio: "Detener",
      play_scene: "🔊 Escuchar",
      playing_scene: "⏸ Reproduciendo…",
      vocab_label: "Aprendemos:",
      audio_unsupported: "El lector de audio no está disponible en este navegador.",
      audio_no_voice: "No hay voz disponible para este idioma.",
      title_tres_porquets: "Los tres cerditos",
      title_caputxeta_vermella: "Caperucita Roja",
      title_gegant_del_pi: "El Gigante del Pino",
      title_rateta: "La Ratita que barría la escalerita",
      title_patufet: "El Patufet",
      title_ventafocs: "Cenicienta",
      title_llebre_i_tortuga: "La liebre y la tortuga",
      title_aneguet_lleig: "El patito feo"
    },
    ca: {
      created_by: "Fet per",
      toggle_theme: "Canviar tema",
      site_title: "Contes interactius",
      site_subtitle: "Tria un conte, posa-li els teus noms i aprèn mentre llegeixes.",
      library_footer: "8 contes clàssics · Contingut i imatges dins de cada carpeta.",
      back: "← Torna a la biblioteca",
      label_tale: "📖 Conte",
      personalize: "Personalitza el teu conte",
      educational_theme: "Tema educatiu del conte",
      twist_numbers: "🔢 Nombres",
      twist_colors:  "🎨 Colors",
      twist_shapes:  "🔺 Formes",
      twist_objects: "🧺 Objectes",
      btn_start: "▶ Comença el conte",
      btn_reset: "↺ Restaura els noms",
      btn_reconfigure: "⚙ Torna a personalitzar",
      btn_another: "📚 Tria un altre conte",
      footer_reader: "Fet amb ♥ per llegir plegats.",
      not_found_title: "No s'ha trobat el conte",
      not_found_body: "Torna a la biblioteca i tria un conte.",
      not_available_title: "Conte no disponible",
      not_available_body: "No s'ha pogut carregar el conte.",
      tag_n: "Nombres", tag_c: "Colors", tag_s: "Formes", tag_o: "Objectes",
      age_label: "Edat del lector",
      age_years: "anys",
      age_band_young: "(Petits)",
      age_band_mid: "(Mitjans)",
      age_band_old: "(Grans)",
      play_all: "Llegir tot el conte",
      stop_audio: "Atura",
      play_scene: "🔊 Escolta",
      playing_scene: "⏸ Llegint…",
      vocab_label: "Aprenem:",
      audio_unsupported: "El lector d'àudio no està disponible en aquest navegador.",
      audio_no_voice: "No hi ha cap veu disponible per a aquest idioma.",
      title_tres_porquets: "Els tres porquets",
      title_caputxeta_vermella: "La Caputxeta Vermella",
      title_gegant_del_pi: "El Gegant del Pi",
      title_rateta: "La Rateta que escombrava l'escaleta",
      title_patufet: "En Patufet",
      title_ventafocs: "La Ventafocs",
      title_llebre_i_tortuga: "La llebre i la tortuga",
      title_aneguet_lleig: "L'aneguet lleig"
    },
    fr: {
      created_by: "Créé par",
      toggle_theme: "Changer de thème",
      site_title: "Contes interactifs",
      site_subtitle: "Choisis un conte, mets les prénoms et apprends en lisant.",
      library_footer: "8 contes classiques · Contenu et images dans chaque dossier.",
      back: "← Retour à la bibliothèque",
      label_tale: "📖 Conte",
      personalize: "Personnalise ton conte",
      educational_theme: "Thème éducatif",
      twist_numbers: "🔢 Nombres",
      twist_colors:  "🎨 Couleurs",
      twist_shapes:  "🔺 Formes",
      twist_objects: "🧺 Objets",
      btn_start: "▶ Commence le conte",
      btn_reset: "↺ Réinitialiser",
      btn_reconfigure: "⚙ Modifier à nouveau",
      btn_another: "📚 Choisir un autre conte",
      footer_reader: "Fait avec ♥ pour lire ensemble.",
      not_found_title: "Conte introuvable",
      not_found_body: "Retourne à la bibliothèque et choisis un conte.",
      not_available_title: "Conte indisponible",
      not_available_body: "Le conte n'a pas pu être chargé.",
      tag_n: "Nombres", tag_c: "Couleurs", tag_s: "Formes", tag_o: "Objets",
      age_label: "Âge du lecteur",
      age_years: "ans",
      age_band_young: "(Petits)",
      age_band_mid: "(Moyens)",
      age_band_old: "(Grands)",
      play_all: "Lire tout le conte",
      stop_audio: "Arrêter",
      play_scene: "🔊 Écouter",
      playing_scene: "⏸ Lecture…",
      vocab_label: "Apprenons :",
      audio_unsupported: "Le lecteur audio n'est pas disponible dans ce navigateur.",
      audio_no_voice: "Aucune voix disponible pour cette langue.",
      title_tres_porquets: "Les trois petits cochons",
      title_caputxeta_vermella: "Le Petit Chaperon Rouge",
      title_gegant_del_pi: "Le Géant du Pin",
      title_rateta: "La Petite Souris qui balayait l'escalier",
      title_patufet: "Le Patufet",
      title_ventafocs: "Cendrillon",
      title_llebre_i_tortuga: "Le lièvre et la tortue",
      title_aneguet_lleig: "Le vilain petit canard"
    }
  };

  // ---------- Theme ----------
  const THEME_KEY = "contes-theme";
  function prefersDark() {
    try {
      return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    } catch (_) { return false; }
  }
  function applyTheme(t) {
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-theme", t);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    const icon = document.getElementById("themeIcon");
    if (icon) {
      const effective = document.documentElement.getAttribute("data-theme")
        || (prefersDark() ? "dark" : "light");
      icon.textContent = effective === "dark" ? "☀️" : "🌙";
    }
  }
  function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") applyTheme(stored);
    else applyTheme(null);
  }
  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme")
      || (prefersDark() ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  // ---------- Language ----------
  const LANG_KEY = "contes-lang";
  function currentLang() {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored && I18N[stored]) return stored;
    // Detect from page html lang first, then from browser
    const htmlLang = (document.documentElement.lang || "").toLowerCase().split("-")[0];
    if (I18N[htmlLang]) return htmlLang;
    const nav = (navigator.language || "en").toLowerCase().split("-")[0];
    return I18N[nav] ? nav : "ca";
  }
  function applyLang(lang) {
    const dict = I18N[lang] || I18N.ca;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      // format: "title:site_title,placeholder:search_ph"
      const spec = el.getAttribute("data-i18n-attr");
      spec.split(",").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (dict[key] != null) el.setAttribute(attr, dict[key]);
      });
    });
    // Swap localized cover images: any <img data-cover-base="path/to/cover-storybook">
    // gets src="path/to/cover-storybook-<lang>.svg" (or the bare .svg for Catalan).
    document.querySelectorAll("img[data-cover-base]").forEach((img) => {
      const base = img.getAttribute("data-cover-base");
      const desired = lang === "ca" ? base + ".svg" : base + "-" + lang + ".svg";
      if (img.getAttribute("src") !== desired) img.setAttribute("src", desired);
      // Keep alt text in sync with the title
      const slug = (base.split("/")[1] || "").replace(/-/g, "_");
      const titleKey = "title_" + slug;
      if (dict[titleKey] != null) img.setAttribute("alt", dict[titleKey]);
    });
    const code = document.getElementById("langCode");
    if (code) code.textContent = lang.toUpperCase();
    const flag = document.getElementById("langFlag");
    if (flag) flag.innerHTML = FLAGS[lang] || FLAGS.en;
    document.querySelectorAll(".lang-opt").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }
  function setLang(lang) {
    if (!I18N[lang]) return;
    localStorage.setItem(LANG_KEY, lang);
    applyLang(lang);
  }

  // Expose for other scripts (reader.js reads translations)
  window.ContesI18N = {
    t(key) {
      const lang = currentLang();
      return (I18N[lang] && I18N[lang][key]) || (I18N.ca[key] || key);
    },
    lang: currentLang
  };

  // ---------- DOM setup ----------
  function buildControls(hostEl) {
    if (!hostEl) return;
    hostEl.innerHTML = `
      <div class="header-author-credit">
        <span data-i18n="created_by">Fet per</span>
        <a href="https://alc1218.github.io/PersonalWebpage/" target="_blank" rel="noopener noreferrer"><span>Arcadi Llanza</span></a>
      </div>
      <button class="theme-btn" id="themeBtn" aria-label="Toggle theme" data-i18n-attr="title:toggle_theme" title="Toggle theme">
        <span id="themeIcon">🌙</span>
      </button>
      <div class="lang-dropdown" id="langDropdown">
        <button class="lang-trigger" id="langTrigger" aria-haspopup="true" aria-expanded="false">
          <span id="langFlag">${FLAGS.ca}</span>
          <span id="langCode">CA</span>
          <span class="caret">▼</span>
        </button>
        <div class="lang-menu" role="menu">
          <button class="lang-opt" data-lang="en" role="menuitem"><span class="flag">${FLAGS.en}</span> EN</button>
          <button class="lang-opt" data-lang="es" role="menuitem"><span class="flag">${FLAGS.es}</span> ES</button>
          <button class="lang-opt active" data-lang="ca" role="menuitem"><span class="flag">${FLAGS.ca}</span> CA</button>
          <button class="lang-opt" data-lang="fr" role="menuitem"><span class="flag">${FLAGS.fr}</span> FR</button>
        </div>
      </div>
    `;
  }

  function wireControls() {
    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

    const langDd = document.getElementById("langDropdown");
    const langTrigger = document.getElementById("langTrigger");
    if (langDd && langTrigger) {
      langTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        langDd.classList.toggle("open");
        langTrigger.setAttribute("aria-expanded", langDd.classList.contains("open"));
      });
      document.addEventListener("click", () => {
        langDd.classList.remove("open");
        langTrigger.setAttribute("aria-expanded", "false");
      });
      langDd.querySelectorAll(".lang-opt").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          setLang(btn.dataset.lang);
          langDd.classList.remove("open");
          langTrigger.setAttribute("aria-expanded", "false");
          // Let readers know, so they can re-render UI labels
          window.dispatchEvent(new CustomEvent("contes-lang-change", { detail: { lang: btn.dataset.lang } }));
        });
      });
    }
  }

  function init() {
    // Mount controls into any host with .header-controls
    document.querySelectorAll(".header-controls").forEach(buildControls);
    initTheme();
    applyLang(currentLang());
    wireControls();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
