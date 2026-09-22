/* Vivid Horizons Sri Lanka — small interactions, no dependencies. */
(function () {
  "use strict";

  /* ---- current year in the footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- sticky header shadow ---- */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    header.classList.toggle("is-stuck", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- mobile nav ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  var closeNav = function () {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") closeNav();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) closeNav();
  });

  /* ---- reveal on scroll ---- */
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 6, 5) * 60) + "ms";
      io.observe(el);
    });
  }

  /* ---- gallery lightbox ---- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var lbClose = document.getElementById("lbClose");
  var lastFocused = null;

  var openLightbox = function (btn) {
    var img = btn.querySelector("img");
    lastFocused = btn;
    lbImg.src = btn.dataset.full;
    lbImg.alt = img ? img.alt : "";
    lbCap.textContent = btn.dataset.caption || "";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();
  };

  var hideLightbox = function () {
    lb.hidden = true;
    lbImg.src = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  };

  document.querySelectorAll(".shot").forEach(function (btn) {
    btn.addEventListener("click", function () { openLightbox(btn); });
  });

  lbClose.addEventListener("click", hideLightbox);
  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target.classList.contains("lb-figure")) hideLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lb.hidden) hideLightbox();
    /* keep focus inside the dialog while it is open */
    if (e.key === "Tab" && !lb.hidden) {
      e.preventDefault();
      lbClose.focus();
    }
  });
})();
