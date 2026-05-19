/**
 * PowerGen Indonesia - Main JavaScript
 * Handles: Modal, Carousel, FAQ, Form Validation
 */

document.addEventListener("DOMContentLoaded", function () {
  // =========================
  // HAMBURGER MENU
  // =========================
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  if (hamburger && menu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      menu.classList.toggle("active");
    });

    // Close menu when a link is clicked
    const menuLinks = menu.querySelectorAll("a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        menu.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
        hamburger.classList.remove("active");
        menu.classList.remove("active");
      }
    });
  }

  // =========================
  // MODAL WHATSAPP
  // =========================
  const modal = document.getElementById("waModal");
  const closeBtn = document.querySelector(".close");
  const waForm = document.getElementById("waForm");
  const modalTriggers = document.querySelectorAll(
    '[data-modal="open"], [onclick="openModal()"]',
  );

  function openModal() {
    if (!modal) return;
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Fokus ke input pertama untuk aksesibilitas
    setTimeout(() => {
      const firstInput = modal.querySelector("input, textarea");
      if (firstInput) firstInput.focus();
    }, 100);
  }

  function closeModal() {
    if (!modal) return;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
  }

  // Event listener untuk trigger modal
  modalTriggers.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openModal();
    });
  });

  // Event listener untuk tombol close
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Tutup modal saat klik di luar area konten
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Tutup modal dengan tombol Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.style.display === "flex") {
      closeModal();
    }
  });

  // Handle form submit WhatsApp
  if (waForm) {
    waForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nama = document.getElementById("nama")?.value.trim();
      const produk = document.getElementById("produk")?.value.trim();
      const pesan = document.getElementById("pesan")?.value.trim();

      // Validasi
      if (!nama || !produk) {
        alert("Harap isi nama dan produk yang diminati");
        return;
      }

      const nomorWA = "6281234567890"; // ⚠️ Ganti dengan nomor WhatsApp Anda

      const text = `Halo Admin PowerGen

Nama : ${nama}
Produk : ${produk}

Pesan :
${pesan}`;

      const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(text)}`;

      // Buka WhatsApp di tab baru
      const newWindow = window.open(url, "_blank");

      if (newWindow) {
        // Reset form dan tutup modal hanya jika berhasil dibuka
        waForm.reset();
        closeModal();
      } else {
        alert("Popup diblokir browser. Silakan izinkan popup untuk WhatsApp.");
      }
    });
  }

  // Export fungsi ke global scope untuk inline onclick HTML
  window.openModal = openModal;
  window.closeModal = closeModal;

  // =========================
  // HERO CAROUSEL
  // =========================
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".slider-btn.prev");
  const nextBtn = document.querySelector(".slider-btn.next");

  let slideIndex = 0;
  let autoSlideInterval;
  const SLIDE_DURATION = 5000; // 5 detik

  // Deklarasi fungsi carousel yang akan di-export
  let updateSlideAttributes,
    showSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    startAutoSlide,
    resetAutoSlide;

  // Inisialisasi carousel hanya jika elemen ada
  if (slides.length > 0 && dots.length > 0) {
    function updateSlideAttributes() {
      slides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === slideIndex);
        slide.setAttribute("aria-hidden", idx !== slideIndex);
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === slideIndex);
        dot.setAttribute("aria-selected", idx === slideIndex);
        dot.setAttribute("tabindex", idx === slideIndex ? "0" : "-1");
      });
    }

    function showSlide(index) {
      // Handle boundary
      if (index >= slides.length) slideIndex = 0;
      else if (index < 0) slideIndex = slides.length - 1;
      else slideIndex = index;

      updateSlideAttributes();
    }

    function nextSlide() {
      showSlide(slideIndex + 1);
      resetAutoSlide();
    }

    function prevSlide() {
      showSlide(slideIndex - 1);
      resetAutoSlide();
    }

    function goToSlide(index) {
      showSlide(index);
      resetAutoSlide();
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    // Event listeners untuk tombol navigasi
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);

    // Event listeners untuk dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => goToSlide(index));

      // Navigasi keyboard untuk dots
      dot.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToSlide(index);
        }
      });
    });

    // Pause autoplay saat hover (opsional, UX yang lebih baik)
    const sliderContainer = document.querySelector(".slider-container");
    if (sliderContainer) {
      sliderContainer.addEventListener("mouseenter", () =>
        clearInterval(autoSlideInterval),
      );
      sliderContainer.addEventListener("mouseleave", startAutoSlide);
    }

    // Inisialisasi awal
    updateSlideAttributes();
    startAutoSlide();
  }

  // Export fungsi carousel ke global scope untuk inline onclick HTML
  window.moveSlide = (direction) => {
    if (direction === -1) prevSlide();
    else if (direction === 1) nextSlide();
  };

  window.currentSlide = (index) => goToSlide(index);

  // =========================
  // FAQ ACCORDION
  // =========================
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (question) {
      // Klik dengan mouse
      question.addEventListener("click", () =>
        toggleFaq(item, question, answer),
      );

      // Klik dengan keyboard (Enter/Space)
      question.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleFaq(item, question, answer);
        }
      });
    }
  });

  function toggleFaq(item, question, answer) {
    const isActive = item.classList.contains("active");

    // Tutup semua FAQ lain
    faqItems.forEach((faq) => {
      if (faq !== item) {
        faq.classList.remove("active");
        faq
          .querySelector(".faq-question")
          ?.setAttribute("aria-expanded", "false");
      }
    });

    // Toggle item saat ini
    item.classList.toggle("active");
    question.setAttribute("aria-expanded", !isActive);
  }

  // =========================
  // SMOOTH SCROLL UNTUK ANCHOR LINKS
  // =========================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Offset untuk navbar fixed
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // =========================
  // LAZY LOAD FALLBACK (untuk browser lama)
  // =========================
  if ("loading" in HTMLImageElement.prototype) {
    // Browser mendukung lazy loading native, tambahkan class
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.classList.add("lazyload");
    });
  } else {
    // Fallback sederhana untuk browser lama (opsional)
    // Bisa ditambahkan library lazyload jika diperlukan
  }
}); // End DOMContentLoaded
