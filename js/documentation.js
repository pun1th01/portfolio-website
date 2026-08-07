/* ═══════════════════════════════════════════════════
   Documentation Page — UI Rendering
   ═══════════════════════════════════════════════════
   Reads data from CTS_DATA (click-to-source-data.js)
   and dynamically renders all sections.
   ═══════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Paths — relative from pages/ to assets/ ── */
  const DOC_BASE_PATH = "../assets/documents/click-to-source-3d/";

  /* ═══════════════════════════════════════════════════
     SVG Icon Helpers
     ═══════════════════════════════════════════════════ */

  function pdfIconSVG() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="11" x2="13" y2="11"/></svg>';
  }

  function viewIconSVG() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  }

  function downloadIconSVG() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 19h14"/></svg>';
  }

  /* ═══════════════════════════════════════════════════
     Overview Section Renderer
     ═══════════════════════════════════════════════════ */

  function overviewIconSVG(type) {
    const icons = {
      problem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      current: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"/></svg>',
      solution: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>'
    };
    return icons[type] || icons.problem;
  }

  function renderOverview() {
    const container = document.getElementById("overview-cards");
    if (!container || !CTS_DATA.overview) return;

    container.innerHTML = CTS_DATA.overview.map(function (card) {
      return '<article class="overview-card">' +
        '<div class="overview-card-icon">' + overviewIconSVG(card.icon) + '</div>' +
        '<h3>' + escapeHtml(card.title) + '</h3>' +
        '<p>' + escapeHtml(card.description) + '</p>' +
        '</article>';
    }).join("");
  }

  /* ═══════════════════════════════════════════════════
     Progress Stages Renderer
     ═══════════════════════════════════════════════════ */

  function renderProgress() {
    const container = document.getElementById("progress-track");
    if (!container || !CTS_DATA.stages) return;

    container.innerHTML = CTS_DATA.stages.map(function (stage, i) {
      var statusClass = stage.status === "completed" ? "completed" :
                        stage.status === "in-progress" ? "in-progress" : "";
      var markerContent = stage.status === "completed" ? "✓" : (i + 1);
      return '<div class="progress-stage ' + statusClass + '">' +
        '<div class="stage-marker">' + markerContent + '</div>' +
        '<span class="stage-label">' + escapeHtml(stage.label) + '</span>' +
        '<span class="stage-title">' + escapeHtml(stage.title) + '</span>' +
        '</div>';
    }).join("");
  }

  /* ═══════════════════════════════════════════════════
     Document Cards Renderer
     ═══════════════════════════════════════════════════ */

  function renderDocumentCards() {
    const container = document.getElementById("doc-grid");
    if (!container) return;

    var docs = CTS_DATA.documents;
    if (!docs || docs.length === 0) {
      container.innerHTML = '<div class="doc-empty">No documentation available yet.</div>';
      return;
    }

    container.innerHTML = docs.map(function (doc) {
      var filePath = DOC_BASE_PATH + encodeURIComponent(doc.file);
      var completedBadge = doc.completed
        ? '<span class="completed-badge is-complete">Completed</span>'
        : '<span class="completed-badge is-draft">In Progress</span>';

      return '<article class="doc-card">' +
        '<div class="doc-icon">' + pdfIconSVG() + '</div>' +
        '<div class="doc-body">' +
          '<h3 class="doc-title">' + escapeHtml(doc.title) + '</h3>' +
          '<p class="doc-desc">' + escapeHtml(doc.description) + '</p>' +
          '<div class="doc-meta">' +
            '<span class="stage-badge">Stage ' + doc.stage + '</span>' +
            completedBadge +
          '</div>' +
          '<div class="doc-actions">' +
            '<a class="doc-btn doc-btn-view" href="' + filePath + '" target="_blank" rel="noopener noreferrer" aria-label="View ' + escapeHtml(doc.title) + '">' +
              viewIconSVG() + ' View' +
            '</a>' +
            '<a class="doc-btn doc-btn-download" href="' + filePath + '" download="' + escapeHtml(doc.file) + '" aria-label="Download ' + escapeHtml(doc.title) + '">' +
              downloadIconSVG() + ' Download' +
            '</a>' +
          '</div>' +
        '</div>' +
        '</article>';
    }).join("");
  }

  /* ═══════════════════════════════════════════════════
     Roadmap Renderer
     ═══════════════════════════════════════════════════ */

  function renderRoadmap() {
    const container = document.getElementById("roadmap-list");
    if (!container || !CTS_DATA.roadmap) return;

    container.innerHTML = CTS_DATA.roadmap.map(function (item) {
      var doneClass = item.done ? "done" : "";
      return '<li class="roadmap-item ' + doneClass + '">' +
        '<div class="roadmap-check"></div>' +
        '<span class="roadmap-text">' + escapeHtml(item.text) + '</span>' +
        '</li>';
    }).join("");
  }

  /* ═══════════════════════════════════════════════════
     Sticky Section Nav — Active Highlight
     ═══════════════════════════════════════════════════ */

  function initSectionNav() {
    var navLinks = Array.from(document.querySelectorAll(".section-nav-list a"));
    var sections = Array.from(document.querySelectorAll(".proj-section[id]"));

    if (!navLinks.length || !sections.length) return;

    // Smooth scroll on nav click
    navLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // Active state on scroll
    function updateActiveNav() {
      var scrollPos = window.scrollY + 120;
      var activeId = sections[0].id;

      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= scrollPos) {
          activeId = sections[i].id;
        }
      }

      navLinks.forEach(function (link) {
        var isActive = link.getAttribute("href") === "#" + activeId;
        link.classList.toggle("active", isActive);
      });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();
  }

  /* ═══════════════════════════════════════════════════
     Reveal Animation (same as portfolio)
     ═══════════════════════════════════════════════════ */

  function initRevealAnimations() {
    var reveals = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      reveals.forEach(function (el) { observer.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("show"); });
    }
  }

  /* ═══════════════════════════════════════════════════
     Footer Year
     ═══════════════════════════════════════════════════ */

  function initFooterYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ═══════════════════════════════════════════════════
     Utility: HTML Escape
     ═══════════════════════════════════════════════════ */

  function escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* ═══════════════════════════════════════════════════
     Initialize Everything on DOM Ready
     ═══════════════════════════════════════════════════ */

  document.addEventListener("DOMContentLoaded", function () {
    renderOverview();
    renderProgress();
    renderDocumentCards();
    renderRoadmap();
    initSectionNav();
    initRevealAnimations();
    initFooterYear();
  });
})();
