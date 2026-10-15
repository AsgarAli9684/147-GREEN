document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector("#navtoggle");
  const modal = document.querySelector("#modal");
  const modalCloseButton = modal?.querySelector("[data-close]");
  const modalCard = modal?.querySelector(".card");
  let lastFocusedElement = null;

  const updateNavOnScroll = function () {
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    }
  };

  updateNavOnScroll();
  window.addEventListener("scroll", updateNavOnScroll, { passive: true });

  document.querySelectorAll(".menu a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (navToggle) {
        navToggle.checked = false;
      }
    });
  });

  const closeModal = function () {
    if (!modal?.classList.contains("open")) {
      return;
    }

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  const openModal = function (trigger) {
    if (!modal) {
      return;
    }

    lastFocusedElement = trigger || null;

    if (navToggle) {
      navToggle.checked = false;
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    modalCloseButton?.focus();
  };

  document.querySelectorAll("[data-open-modal]").forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      if (!modal) {
        return;
      }

      event.preventDefault();
      openModal(trigger);
    });
  });

  openModal();

  modalCloseButton?.addEventListener("click", closeModal);

  modal?.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
      if (navToggle) {
        navToggle.checked = false;
      }
    }

    if (
      event.key === "Tab" &&
      modal?.classList.contains("open") &&
      modalCard
    ) {
      const focusableElements = modalCard.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        modalCloseButton?.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });

});
