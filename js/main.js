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

let navClickLockSectionId = null;
let navClickLockUntil = 0;

function handleSmoothScroll() {
  function getHeaderOffset(extra) {
    const siteHeader = document.querySelector(".site-header");
    return (siteHeader ? siteHeader.offsetHeight : 0) + extra;
  }

  document.querySelectorAll('a[href^="#"]:not([href="#!"])').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) {
        return;
      }

      event.preventDefault();
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const absoluteTop = targetSection.getBoundingClientRect().top + window.scrollY;
        const headerOffset = getHeaderOffset(12);
        const centeredTop = absoluteTop - (window.innerHeight - targetSection.offsetHeight) / 2;
        const preferredTop = targetId === "#links" ? centeredTop : absoluteTop - headerOffset;
        const maxScrollTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const targetTop = Math.min(maxScrollTop, Math.max(0, preferredTop));

        navClickLockSectionId = targetSection.id;
        navClickLockUntil = Date.now() + 1200;

        window.scrollTo({
          top: targetTop,
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
  let hoveredSectionId = null;

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

  function setHoveredSection(sectionId) {
    sections.forEach(function (section) {
      const isHovered = section.id === sectionId;
      section.classList.toggle("section-hover-active", isHovered);
    });
  }

  function updateActiveSection() {
    if (hoveredSectionId) {
      return;
    }

    if (navClickLockSectionId && Date.now() < navClickLockUntil) {
      setActiveById(navClickLockSectionId);
      return;
    }

    navClickLockSectionId = null;

    const siteHeader = document.querySelector(".site-header");
    const headerOffset = (siteHeader ? siteHeader.offsetHeight : 0) + 20;
    const scrollMarker = window.scrollY + headerOffset;
    const docHeight = document.documentElement.scrollHeight;
    const viewportBottom = window.scrollY + window.innerHeight;

    if (viewportBottom >= docHeight - 2) {
      setActiveById(sections[sections.length - 1].id);
      return;
    }

    let activeSectionId = sections[0].id;

    for (let index = 0; index < sections.length; index += 1) {
      const currentSection = sections[index];
      const currentTop = currentSection.offsetTop;
      const nextSection = sections[index + 1];

      if (!nextSection) {
        if (scrollMarker >= currentTop) {
          activeSectionId = currentSection.id;
        }
        break;
      }

      const nextTop = nextSection.offsetTop;

      if (scrollMarker >= currentTop && scrollMarker < nextTop) {
        activeSectionId = currentSection.id;
        break;
      }
    }

    setActiveById(activeSectionId);
  }

  sections.forEach(function (section) {
    section.addEventListener("mouseenter", function () {
      hoveredSectionId = section.id;
      setHoveredSection(hoveredSectionId);
      setActiveById(hoveredSectionId);
    });

    section.addEventListener("mouseleave", function () {
      hoveredSectionId = null;
      setHoveredSection(null);
      updateActiveSection();
    });
  });

  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
  updateActiveSection();
}

function createModalController(config) {
  const modalOverlay = document.getElementById(config.overlayId);
  const modalClose = document.getElementById(config.closeId);
  const trigger = document.getElementById(config.triggerId);

  if (!modalOverlay || !modalClose || !trigger) {
    return null;
  }

  let lastFocusedElement = null;

  function openModal() {
    lastFocusedElement = document.activeElement;
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (typeof config.onOpen === "function") {
      config.onOpen();
    }

    modalClose.focus();
  }

  function closeModal() {
    if (!modalOverlay.classList.contains("open")) {
      return;
    }

    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal-overlay.open")) {
      document.body.classList.remove("modal-open");
    }

    if (typeof config.onClose === "function") {
      config.onClose();
    }

    const fallbackFocus = lastFocusedElement || trigger;
    if (fallbackFocus && typeof fallbackFocus.focus === "function") {
      fallbackFocus.focus();
    }
  }

  trigger.addEventListener("click", openModal);
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

  return {
    isOpen: function () {
      return modalOverlay.classList.contains("open");
    },
    open: openModal,
    close: closeModal,
  };
}

function handleProjectModal() {
  createModalController({
    overlayId: "aboutProjectModal",
    closeId: "modalClose",
    triggerId: "aboutProjectTrigger",
  });
}

function handleSneakPeekModal() {
  const worldGeneratorImageFiles = Array.from({ length: 14 }, function (_, index) {
    const fileNumber = String(index + 1).padStart(2, "0");
    return "worldgen-sneakpeek-" + fileNumber + ".png";
  });

  const previewImages = worldGeneratorImageFiles.map(function (fileName, index) {
    return {
      src: "assets/images/world-generator/" + encodeURIComponent(fileName),
      alt: "World generator sneak peek screenshot " + (index + 1),
    };
  });

  const sneakPeekImage = document.getElementById("worldSneakPeekImage");
  const prevButton = document.getElementById("worldSneakPeekPrev");
  const nextButton = document.getElementById("worldSneakPeekNext");
  const dotsContainer = document.getElementById("worldSneakPeekDots");

  if (!sneakPeekImage || !prevButton || !nextButton || !dotsContainer || !previewImages.length) {
    return;
  }

  let currentIndex = 0;

  function normalizeIndex(index) {
    return (index + previewImages.length) % previewImages.length;
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach(function (dot, dotIndex) {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function setSlide(nextIndex, direction, animate) {
    const normalizedIndex = normalizeIndex(nextIndex);
    const slide = previewImages[normalizedIndex];
    const shouldAnimate = animate !== false;

    currentIndex = normalizedIndex;

    function commitSlide() {
      sneakPeekImage.src = slide.src;
      sneakPeekImage.alt = slide.alt;
      sneakPeekImage.classList.remove("is-changing");
      sneakPeekImage.removeAttribute("data-direction");
    }

    if (shouldAnimate) {
      sneakPeekImage.setAttribute("data-direction", direction === "prev" ? "prev" : "next");
      sneakPeekImage.classList.add("is-changing");
      window.setTimeout(commitSlide, 150);
    } else {
      commitSlide();
    }

    updateDots();
  }

  function renderDots() {
    dotsContainer.innerHTML = "";
    previewImages.forEach(function (_, index) {
      const dotButton = document.createElement("button");
      dotButton.type = "button";
      dotButton.className = "carousel-dot";
      dotButton.setAttribute("aria-label", "View screenshot " + (index + 1));

      dotButton.addEventListener("click", function () {
        const direction = index >= currentIndex ? "next" : "prev";
        setSlide(index, direction, true);
      });

      dotsContainer.appendChild(dotButton);
    });
  }

  function showNextSlide() {
    setSlide(currentIndex + 1, "next", true);
  }

  function showPreviousSlide() {
    setSlide(currentIndex - 1, "prev", true);
  }

  prevButton.addEventListener("click", showPreviousSlide);
  nextButton.addEventListener("click", showNextSlide);

  const modalController = createModalController({
    overlayId: "worldSneakPeekModal",
    closeId: "worldSneakPeekClose",
    triggerId: "worldSneakPeekTrigger",
    onOpen: function () {
      setSlide(currentIndex, "next", false);
    },
  });

  if (!modalController) {
    return;
  }

  document.addEventListener("keydown", function (event) {
    if (!modalController.isOpen()) {
      return;
    }

    if (event.key === "ArrowRight") {
      showNextSlide();
    }

    if (event.key === "ArrowLeft") {
      showPreviousSlide();
    }
  });

  renderDots();
  setSlide(0, "next", false);
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
  handleSneakPeekModal();
  handleAnimations();
});
