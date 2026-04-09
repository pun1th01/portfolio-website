function handleNavbarScroll() {
  const navToggle = document.getElementById("navToggle");
  const navList = document.getElementById("navList");
  const navWrap = document.querySelector(".nav-wrap");

  if (!navToggle || !navList || !navWrap) {
    return;
  }

  navToggle.addEventListener("click", function () {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navList.classList.toggle("open");
  });

  document.querySelectorAll(".nav-list a").forEach(function (link) {
    link.addEventListener("click", function () {
      navList.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", function (event) {
    if (!navWrap.contains(event.target)) {
      navList.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 740) {
      navList.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function handleSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#!"])').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) {
        return;
      }

      event.preventDefault();
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const siteHeader = document.querySelector(".site-header");
        const headerOffset = siteHeader ? siteHeader.offsetHeight + 12 : 12;
        const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth",
        });
      }
    });
  });

  document.querySelectorAll('a[href="#!"]').forEach(function (placeholderLink) {
    placeholderLink.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });
}

function handleActiveSectionHighlight() {
  const navLinks = Array.from(document.querySelectorAll(".nav-list a"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  if (!navLinks.length || !sections.length) {
    return;
  }

  function setActiveById(sectionId) {
    navLinks.forEach(function (link) {
      const isActive = link.getAttribute("href") === "#" + sectionId;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateActiveSection() {
    const siteHeader = document.querySelector(".site-header");
    const headerOffset = siteHeader ? siteHeader.offsetHeight + 20 : 20;
    const scrollMarker = window.scrollY + headerOffset;
    let activeSectionId = sections[0].id;

    sections.forEach(function (section) {
      if (scrollMarker >= section.offsetTop) {
        activeSectionId = section.id;
      }
    });

    setActiveById(activeSectionId);
  }

  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
  updateActiveSection();
}

function handleProjectModal() {
  const modalOverlay = document.getElementById("aboutProjectModal");
  const modalClose = document.getElementById("modalClose");
  const aboutProjectTrigger = document.getElementById("aboutProjectTrigger");

  if (!modalOverlay || !modalClose || !aboutProjectTrigger) {
    return;
  }

  function openModal() {
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    aboutProjectTrigger.focus();
  }

  aboutProjectTrigger.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", function (event) {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modalOverlay.classList.contains("open")) {
      closeModal();
    }
  });
}

function handleAnimations() {
  const reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    reveals.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    reveals.forEach(function (item) {
      item.classList.add("show");
    });
  }

  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  handleNavbarScroll();
  handleSmoothScroll();
  handleActiveSectionHighlight();
  handleProjectModal();
  handleAnimations();
});
