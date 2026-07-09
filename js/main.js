/* ============================================================
   Kyaw Thi (Eric) Ha — Portfolio interactions
   ============================================================ */
(function () {
  "use strict";

  const shot = location.search.indexOf("shot") > -1;   // static-capture mode
  if (shot) document.documentElement.classList.add("shot");
  const reduceMotion = shot || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarse = window.matchMedia("(hover: none)").matches;

  /* ---------- Plus grid ---------- */
  const pg = document.querySelector(".plusgrid");
  if (pg) for (let i = 0; i < 16; i++) pg.appendChild(document.createElement("span"));

  /* ---------- Glitch inside the hero device screen ---------- */
  let glitchBoost = function () {};
  (function screenGlitch() {
    const cv = document.getElementById("glitch");
    const screen = document.getElementById("screen");
    if (!cv || !screen || reduceMotion) { if (cv) cv.style.opacity = "0"; return; }
    const ctx = cv.getContext("2d");
    let W = 0, H = 0, frame = 0, flash = 0, bands = [];

    const tile = document.createElement("canvas"); tile.width = tile.height = 96;
    const tctx = tile.getContext("2d");
    function genTile(a) {
      const img = tctx.createImageData(96, 96), d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = Math.random() * a;
      }
      tctx.putImageData(img, 0, 0);
    }
    function size() { const r = screen.getBoundingClientRect(); W = cv.width = Math.max(2, r.width | 0); H = cv.height = Math.max(2, r.height | 0); }
    size(); window.addEventListener("resize", size, { passive: true });
    genTile(60);

    function spawn(n, big) {
      for (let i = 0; i < n; i++) bands.push({
        y: Math.random() * H, h: (big ? 8 : 2) + Math.random() * (big ? 42 : 22),
        dx: Math.random() * 44 - 22, life: 3 + ((Math.random() * (big ? 6 : 8)) | 0),
      });
    }
    glitchBoost = function () { spawn(11, true); flash = frame + 8; };   // burst on slide switch

    function loop() {
      frame++;
      const boost = frame < flash;
      ctx.fillStyle = "#0b0b0b"; ctx.fillRect(0, 0, W, H);   // black = transparent under 'screen' blend
      genTile(boost ? 135 : 62);
      const pat = ctx.createPattern(tile, "repeat");
      ctx.globalAlpha = boost ? .85 : .5; ctx.fillStyle = pat;
      ctx.save(); ctx.translate(-Math.random() * 96, -Math.random() * 96); ctx.fillRect(0, 0, W + 96, H + 96); ctx.restore();
      ctx.globalAlpha = 1;
      const sy = (frame * 2) % (H + 60) - 30;
      const g = ctx.createLinearGradient(0, sy, 0, sy + 46);
      g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(.5, "rgba(255,255,255,.10)"); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g; ctx.fillRect(0, sy, W, 46);
      if (Math.random() < (boost ? .9 : .13)) spawn(1 + ((Math.random() * 2) | 0), boost);
      bands = bands.filter((b) => b.life-- > 0);
      bands.forEach((b) => {
        ctx.fillStyle = "rgba(255,255,255," + (boost ? .24 : .14) + ")"; ctx.fillRect(0, b.y, W, b.h);
        ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.fillRect(b.dx, b.y, W, 1);
      });
      if (boost && Math.random() < .5) { ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(0, 0, W, H); }
      requestAnimationFrame(loop);
    }
    loop();
  })();

  /* ---------- Hero screen: project slideshow ---------- */
  (function slideshow() {
    const slides = document.getElementById("slides");
    if (!slides) return;
    const imgs = [...document.querySelectorAll(".wkrow")].map((r) => r.dataset.img).filter(Boolean);
    if (!imgs.length) return;
    const els = imgs.map((src, i) => {
      const d = document.createElement("div");
      d.className = "screen__slide" + (i === 0 ? " active" : "");
      d.style.backgroundImage = `url("${src}")`;
      slides.appendChild(d);
      return d;
    });
    if (els.length < 2 || reduceMotion) return;
    let idx = 0;
    setInterval(() => {
      els[idx].classList.remove("active");
      idx = (idx + 1) % els.length;
      els[idx].classList.add("active");
      glitchBoost();
    }, 1500);
  })();

  /* ---------- Scroll-driven fade-to-bold statements ---------- */
  (function scrollFill() {
    const fills = [...document.querySelectorAll(".scroll-fill")];
    if (!fills.length) return;
    const groups = fills.map((el) => {
      const tokens = el.textContent.trim().split(/(\s+)/);
      el.textContent = "";
      tokens.forEach((tok) => {
        if (tok === "") return;
        if (/^\s+$/.test(tok)) el.appendChild(document.createTextNode(" "));
        else { const s = document.createElement("span"); s.className = "w"; s.textContent = tok; el.appendChild(s); }
      });
      return { el, ws: [...el.querySelectorAll(".w")] };
    });
    const allWords = groups.flatMap((g) => g.ws);
    if (reduceMotion) { allWords.forEach((w) => w.style.setProperty("--t", "1")); return; }
    let ticking = false;
    function update() {
      ticking = false;
      const vh = innerHeight;
      for (const g of groups) {
        const r = g.el.getBoundingClientRect();
        // progress 0→1 as the block scrolls up through the viewport
        let p = (vh * 0.82 - r.top) / (vh * 0.55);
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        const n = g.ws.length, pos = p * n;   // fractional count of revealed words
        for (let i = 0; i < n; i++) {
          let t = pos - i; t = t < 0 ? 0 : t > 1 ? 1 : t;   // each word fades in, one after the next
          g.ws[i].style.setProperty("--t", t.toFixed(3));
        }
      }
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  })();

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById("preloader");
  const counter = document.getElementById("counter");
  function finishLoad() {
    document.body.classList.add("loaded");
    if (preloader) { preloader.classList.add("done"); setTimeout(() => { preloader.style.display = "none"; }, 1150); }
    document.body.style.overflow = "";
    initReveal();
  }
  function runPreloader() {
    if (reduceMotion || !preloader || !counter) { if (preloader) preloader.style.display = "none"; finishLoad(); return; }
    document.body.style.overflow = "hidden";
    let n = 0;
    const t = setInterval(() => {
      n += Math.floor(Math.random() * 8) + 4;
      if (n >= 100) { n = 100; clearInterval(t); setTimeout(finishLoad, 380); }
      counter.textContent = n;
    }, 95);
  }

  /* ---------- Dual clock ---------- */
  const clockLA = document.getElementById("clockLA");
  const clockMM = document.getElementById("clockMM");
  const footTime = document.getElementById("footTime");
  const fmt = (tz) => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz });
  function tickClock() {
    if (clockLA) clockLA.textContent = fmt("America/Los_Angeles");
    if (clockMM) clockMM.textContent = fmt("Asia/Yangon");
    if (footTime) footTime.textContent = fmt("America/Los_Angeles") + " PT";
  }
  tickClock(); setInterval(tickClock, 15000);
  const yearEl = document.getElementById("year"); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Cursor ---------- */
  const cursor = document.getElementById("cursor");
  if (cursor && !isCoarse) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
    (function loop() { cx += (mx - cx) * .2; cy += (my - cy) * .2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`; requestAnimationFrame(loop); })();
    document.querySelectorAll("[data-cursor]").forEach((el) => {
      const type = el.getAttribute("data-cursor");
      el.addEventListener("mouseenter", () => { cursor.classList.add("hover"); if (type === "view") cursor.classList.add("view"); });
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover", "view"));
    });
  }

  /* ---------- Work: column preview + toggle ---------- */
  const works = document.getElementById("works");
  const rows = [...document.querySelectorAll(".wkrow")];
  const pImg = document.getElementById("worksPreviewImg");
  const pPh = document.getElementById("worksPreviewPh");
  const pDesc = document.getElementById("worksPreviewDesc");
  const pTags = document.getElementById("worksPreviewTags");
  const pLink = document.getElementById("worksPreview");

  function selectRow(li) {
    rows.forEach((r) => r.classList.remove("active"));
    li.classList.add("active");
    if (pPh) pPh.textContent = li.dataset.name || "";
    if (pDesc) pDesc.textContent = li.dataset.desc || "";
    if (pTags) pTags.textContent = li.dataset.tags || "";
    if (pLink && li.dataset.href) pLink.href = li.dataset.href;
    if (pImg) {
      pImg.style.display = "none";
      pImg.onload = () => { pImg.style.display = "block"; };
      pImg.onerror = () => { pImg.style.display = "none"; };
      if (li.dataset.img) pImg.src = li.dataset.img;
    }
  }
  rows.forEach((li) => li.addEventListener("mouseenter", () => { if (!works || works.dataset.view === "column") selectRow(li); }));
  if (rows[0]) selectRow(rows[0]);

  document.querySelectorAll(".work__toggle button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".work__toggle button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (works) works.dataset.view = btn.dataset.view;
    });
  });

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const els = document.querySelectorAll("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Nav hide on scroll ---------- */
  const nav = document.getElementById("nav");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("up", y > lastY && y > 240);
    lastY = y;
  }, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (burger && mobileMenu) {
    const toggle = (open) => {
      burger.classList.toggle("open", open); mobileMenu.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => toggle(!mobileMenu.classList.contains("open")));
    mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggle(false)));
  }

  /* ---------- Contact form → mailto ---------- */
  const form = document.getElementById("contactForm");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const name = (d.get("name") || "").toString().trim();
    const email = (d.get("email") || "").toString().trim();
    const msg = (d.get("message") || "").toString().trim();
    const topic = (d.get("topic") || "Hello").toString();
    window.location.href = `mailto:kyawthiha1610@gmail.com?subject=${encodeURIComponent("Portfolio — " + topic + " — " + name)}&body=${encodeURIComponent(msg + "\n\n— " + name + "\n" + email)}`;
  });

  /* ---------- Kick off ---------- */
  if (document.readyState === "complete") runPreloader();
  else window.addEventListener("load", runPreloader);
  setTimeout(() => { if (!document.body.classList.contains("loaded")) finishLoad(); }, 4000);
})();
