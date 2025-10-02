// JavaScript TwójSkup24

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initMobileMenu();
  initBusinessStatistics(); // Initialize business statistics first
  initCounters();
  initPricingCalculator();
  initExitIntent();
  initSocialProof();
  initReviewsSlider(); // Initialize reviews slider
  initScrollAnimations();
  initYearDropdown();
  initCookieSettingsLink();
});

// Mobile Menu Toggle
function initMobileMenu() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  }
}

// Counter Animation
function initCounters() {
  const counters = document.querySelectorAll(".counter");

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const suffix = counter.getAttribute("data-suffix") || "";
    const increment = target / 100;
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        const displayValue = Math.ceil(current);
        counter.textContent =
          (displayValue > 999
            ? displayValue.toLocaleString("pl-PL")
            : displayValue) + suffix;
        setTimeout(updateCounter, 20);
      } else {
        const displayValue =
          target > 999 ? target.toLocaleString("pl-PL") : target;
        counter.textContent = displayValue + suffix;
      }
    };

    updateCounter();
  };

  // Trigger animation when counters are visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });

  counters.forEach((counter) => observer.observe(counter));
}

// Pricing Calculator
function initPricingCalculator() {
  const form = document.getElementById("pricing-form");
  const successMessage = document.getElementById("pricing-success");
  const errorMessage = document.getElementById("pricing-error");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      brand: formData.get("brand")?.trim() || "",
      model: formData.get("model")?.trim() || "",
      productionYear: formData.get("productionYear") || "",
      fuelType: formData.get("fuelType") || "",
      technicalCondition: formData.get("technicalCondition")?.trim() || "",
      fullName: formData.get("fullName")?.trim() || "",
      phone: formData.get("phone")?.trim() || "",
      email: formData.get("email")?.trim() || "",
      privacyAgreement:
        formData.get("privacy-agreement") === "on" ? "true" : "false",
      submittedAt: new Date().toISOString(),
      sourcePage: window.location.pathname || "",
    };

    if (
      !payload.brand ||
      !payload.model ||
      !payload.productionYear ||
      !payload.fullName ||
      !payload.phone ||
      !payload.email
    ) {
      form.classList.add("shake");
      setTimeout(() => form.classList.remove("shake"), 500);
      return;
    }

    try {
      window.dispatchEvent(
        new CustomEvent("pricing-form:submission", { detail: payload })
      );

      const response = await sendPricingForm(payload);

      if (response?.success) {
        form.reset();
        successMessage?.classList.remove("hidden");
        errorMessage?.classList.add("hidden");
        successMessage?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        throw new Error(response?.error || "Nie udało się wysłać wiadomości.");
      }
    } catch (error) {
      console.error("❌ Form: Email sending failed:", error);
      successMessage?.classList.add("hidden");
      if (errorMessage) {
        errorMessage.classList.remove("hidden");
        errorMessage.textContent =
          error?.message ||
          "Nie udało się wysłać wiadomości. Spróbuj ponownie.";
      }
    }
  });
}

// Exit Intent Popup
function initExitIntent() {
  const popup = document.getElementById("exit-intent-popup");
  const closeBtn = document.getElementById("close-popup");
  const form = document.getElementById("exit-popup-form");
  let exitIntentShown = false;

  // Show popup on mouse leave (desktop only)
  if (window.innerWidth > 768) {
    document.addEventListener("mouseleave", function (e) {
      if (
        e.clientY <= 0 &&
        !exitIntentShown &&
        !localStorage.getItem("exit-popup-shown")
      ) {
        showExitPopup();
      }
    });
  }

  // Show popup after 300 seconds (mobile and desktop)
  setTimeout(() => {
    if (!exitIntentShown && !localStorage.getItem("exit-popup-shown")) {
      showExitPopup();
    }
  }, 300000);

  // Also trigger on scroll (mobile engagement)
  let scrollTriggered = false;
  window.addEventListener("scroll", function () {
    const scrollPercent =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
      100;
    if (
      scrollPercent > 80 &&
      !scrollTriggered &&
      !exitIntentShown &&
      !localStorage.getItem("exit-popup-shown")
    ) {
      scrollTriggered = true;
      setTimeout(() => showExitPopup(), 2000);
    }
  });

  function showExitPopup() {
    exitIntentShown = true;
    popup.classList.add("show");
    localStorage.setItem("exit-popup-shown", "true");
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      popup.classList.remove("show");
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get("name");
      const phone = formData.get("phone");

      // In real implementation, send to server

      alert("Dziękujemy! Skontaktujemy się z Tobą wkrótce.");
      popup.classList.remove("show");
    });
  }

  // Close on background click
  popup.addEventListener("click", function (e) {
    if (e.target === popup) {
      popup.classList.remove("show");
    }
  });
}

// Enhanced Deterministic Social Proof System
function initSocialProof() {
  // Advanced obfuscation with multiple encoding layers
  (function () {
    // Obfuscated base64 encoded keys rotated by 3
    const _0xabc1 = [
      "ZFNmVDA0X2NhcnM=",
      "ZFNmVDA0X2RheQ==",
      "ZFNmVDA0X2xhc3Q=",
      "ZFNmVDA0X3ZpZXc=",
    ];
    const _0xdef2 = _0xabc1.map((x) => {
      try {
        return atob(x);
      } catch (e) {
        return "";
      }
    });
    const _0x1234 = _0xdef2.map((x) => btoa(x.slice(3).replace("04", "24")));
    const [k1, k2, k3, k4] = _0x1234;

    const viewersEl = document.getElementById("viewers-count");
    const carsEl = document.getElementById("cars-bought");

    // Secure storage with XOR obfuscation
    const _salt = 0x2a; // Static salt for XOR

    function _encode(val) {
      try {
        const str = val.toString();
        const encoded = str
          .split("")
          .map((c) => String.fromCharCode(c.charCodeAt(0) ^ _salt))
          .join("");
        return btoa(encoded);
      } catch (e) {
        return null;
      }
    }

    function _decode(encoded, fallback) {
      try {
        if (!encoded) return fallback;
        const decoded = atob(encoded);
        const original = decoded
          .split("")
          .map((c) => String.fromCharCode(c.charCodeAt(0) ^ _salt))
          .join("");
        const num = parseInt(original, 10);
        return isNaN(num) ? fallback : num;
      } catch (e) {
        return fallback;
      }
    }

    function _store(key, value) {
      try {
        localStorage.setItem(key, _encode(value));
      } catch (e) {}
    }

    function _retrieve(key, fallback) {
      try {
        const stored = localStorage.getItem(key);
        return _decode(stored, fallback);
      } catch (e) {
        return fallback;
      }
    }

    // Deterministic algorithm based on date/time
    function _getDeterministicSeed() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hour = now.getHours();

      // Create deterministic seed that changes hourly
      return year * 10000 + month * 100 + day + hour * 7919; // 7919 is prime
    }

    function _seededRandom(seed) {
      // Linear congruential generator for deterministic randomness
      const a = 1664525;
      const c = 1013904223;
      const m = Math.pow(2, 32);
      return ((a * seed + c) % m) / m;
    }

    function _isDailyResetTime() {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Reset occurs at 7:59
      return hour === 7 && minute === 59;
    }

    function _getBusinessHour() {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Business hours: 8:00-18:07
      if (hour < 8 || hour > 18 || (hour === 18 && minute > 7)) {
        return -1; // Outside business hours
      }

      return hour - 8; // Returns 0-10 for business hours
    }

    function _calculateViewers() {
      const seed = _getDeterministicSeed();
      const base = _seededRandom(seed);
      const minute = new Date().getMinutes();

      // Changes every 5 minutes for natural variation
      const timeSlot = Math.floor(minute / 5);
      const slotSeed = seed + timeSlot * 1009; // 1009 is prime
      const slotRandom = _seededRandom(slotSeed);

      // Range 1-19 with tendency toward middle values
      const normalizedValue = Math.sin(slotRandom * Math.PI) * 0.8 + 0.1;
      return Math.max(1, Math.min(19, Math.round(normalizedValue * 18 + 1)));
    }

    function _calculateCarsToday() {
      const now = new Date();
      const businessHour = _getBusinessHour();

      // Reset check at 7:59
      const today = now.toDateString();
      const storedDay = localStorage.getItem("_tss24_day_check");

      if (storedDay !== today || _isDailyResetTime()) {
        localStorage.setItem("_tss24_day_check", today);
        _store(k1, 0); // Reset cars count
        _store(k3, 0); // Reset last increment time
      }

      // Outside business hours or before 8:00
      if (businessHour < 0) {
        return _retrieve(k1, 0);
      }

      // Sold cars calculation
      const dayOfYear = Math.floor(
        (now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
      );
      const hourSeed = _getDeterministicSeed() + dayOfYear * 31; // 31 is prime

      // Maximum cars per day based on business hours (10.12 hours ≈ 10 cars max)
      const maxCarsForHour = Math.min(businessHour + 1, 10);

      // Probability increases throughout the day
      const hourProgress = businessHour / 10;
      const baseChance = 0.7 + hourProgress * 0.3; // 70-100% chance

      const hourRandom = _seededRandom(hourSeed);
      let expectedCars = 0;

      // Calculate how many cars should be sold by this hour
      for (let h = 0; h <= businessHour; h++) {
        const hSeed = hourSeed + h * 101; // 101 is prime
        const hRandom = _seededRandom(hSeed);
        const chance = 0.6 + (h / 10) * 0.4; // Increasing chance throughout day

        if (hRandom < chance) {
          expectedCars++;
        }
      }

      // Ensure minimum progression but natural variation
      const currentCars = _retrieve(k1, 0);
      const targetCars = Math.min(expectedCars, maxCarsForHour);

      // Smooth progression only increment if behind schedule
      if (currentCars < targetCars) {
        const lastCheck = _retrieve(k3, 0);
        const currentTime = now.getTime();

        // Rate limiting: maximum 1 car per hour (3600000 ms)
        if (currentTime - lastCheck >= 3600000 || lastCheck === 0) {
          const newCount = currentCars + 1;
          _store(k1, newCount);
          _store(k3, currentTime);
          return newCount;
        }
      }

      return Math.max(0, currentCars);
    }

    function _updateDisplay() {
      // Calculate deterministic values
      const viewers = _calculateViewers();
      const cars = _calculateCarsToday();

      // Update DOM elements
      if (viewersEl) {
        viewersEl.textContent = viewers;
      }

      if (carsEl) {
        carsEl.textContent = cars;
      }

      // Store current state for consistency
      _store(k4, viewers);
    }

    // Initialize immediately
    _updateDisplay();

    // Update every 30-90 seconds
    function _scheduleNext() {
      const baseInterval = 45000; // 45 seconds base
      const jitter = (Math.random() - 0.5) * 30000; // ±15 seconds
      const interval = Math.max(30000, baseInterval + jitter);

      setTimeout(() => {
        _updateDisplay();
        _scheduleNext();
      }, interval);
    }

    _scheduleNext();
  })(); // End obfuscated IIFE
}

// Scroll Animations and Lazy Loading
function initScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));

  // Initialize lazy loading for maps and heavy content with consent enforcement
  initConsentAwareLazyLoading();
}

// GDPR-Compliant Lazy Loading Implementation
function initConsentAwareLazyLoading() {
  const lazyElements = document.querySelectorAll(".lazy");

  const lazyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const consentCategory = element.dataset.consentCategory;

          // Check consent before loading third-party content
          if (consentCategory) {
            const consentManager =
              window.consentManager || window.parent?.consentManager;
            if (consentManager) {
              const consentStatus = consentManager.getConsentStatus();
              const hasRequiredConsent =
                consentStatus?.analytics_storage ||
                consentStatus?.functionality_storage;
              if (!hasRequiredConsent) {
                // Show consent placeholder for Google Maps
                if (
                  element.querySelector('iframe[data-src*="google.com/maps"]')
                ) {
                  element.innerHTML = `
                                    <div style="background: #f8f9fa; padding: 20px; text-align: center; border: 1px solid #dee2e6; border-radius: 8px;">
                                        <p style="margin: 0 0 10px 0; color: #6c757d;">Aby wyświetlić mapę Google, wymagana jest zgoda na pliki analityczne.</p>
                                        <button onclick="(window.consentManager || window.parent?.consentManager)?.showBanner?.()" style="background: #fbaf2e; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Zarządzaj zgodami</button>
                                    </div>
                                `;
                }
                lazyObserver.unobserve(element);
                return;
              }
            }
          }

          // Handle iframe lazy loading (for Google Maps)
          const iframe = element.querySelector("iframe");
          if (iframe && iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute("data-src");
          }

          // Handle image lazy loading
          if (element.tagName === "IMG" && element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute("data-src");
          }

          element.classList.add("loaded");
          element.classList.remove("lazy");
          lazyObserver.unobserve(element);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "50px 0px",
    }
  );

  lazyElements.forEach((el) => lazyObserver.observe(el));
}

// Initialize Year Dropdown
function initYearDropdown() {
  const yearSelect = document.getElementById("productionYear");
  if (yearSelect) {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1990; year--) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }
  }
}

// Enhanced Business Statistics Calculator
function initBusinessStatistics() {
  // Company founding constants
  const COMPANY_FOUNDED_YEAR = 2011;
  const AVERAGE_CARS_PER_YEAR = 850;
  const CUSTOMER_SATISFACTION = 100;

  // Calculate years of experience
  function calculateYearsExperience() {
    const currentYear = new Date().getFullYear();
    return currentYear - COMPANY_FOUNDED_YEAR;
  }

  // Calculate total cars purchased over company lifetime
  function calculateTotalCarsPurchased() {
    const yearsInBusiness = calculateYearsExperience();
    // Simple calculation: years * average cars per year
    const totalCars = yearsInBusiness * AVERAGE_CARS_PER_YEAR;
    return Math.round(totalCars);
  }

  // Google rating getter with async config file support
  function getGoogleRating() {
    try {
      // Check cache first 24 hour expiry
      const cachedRating = localStorage.getItem("_tss24_google_rating");
      const cachedTime = localStorage.getItem("_tss24_rating_time");
      const now = new Date().getTime();

      if (cachedRating && cachedTime && now - parseInt(cachedTime) < 86400000) {
        return parseFloat(cachedRating);
      }

      // Check for manual override in localStorage
      const manualRating = localStorage.getItem("_tss24_manual_rating");
      if (manualRating && !isNaN(parseFloat(manualRating))) {
        const rating = parseFloat(manualRating);
        localStorage.setItem("_tss24_google_rating", rating.toString());
        localStorage.setItem("_tss24_rating_time", now.toString());
        return rating;
      }

      // Try to fetch from config file (async, but don't wait)
      fetch("./rating-config.json")
        .then((response) => (response.ok ? response.json() : null))
        .then((config) => {
          if (config && config.googleRating) {
            const configTime = new Date(config.lastUpdated).getTime();
            const now = new Date().getTime();
            // Use config if updated within last 7 days
            if (now - configTime < 604800000) {
              localStorage.setItem(
                "_tss24_google_rating",
                config.googleRating.toString()
              );
              localStorage.setItem("_tss24_rating_time", now.toString());
              // Update display if element exists
              const ratingElement = document.getElementById("google-rating");
              if (ratingElement) {
                ratingElement.textContent = parseFloat(
                  config.googleRating
                ).toFixed(1);
              }
            }
          }
        })
        .catch((e) => {});

      // Use default rating and cache it
      const defaultRating = 4.8;
      localStorage.setItem("_tss24_google_rating", defaultRating.toString());
      localStorage.setItem("_tss24_rating_time", now.toString());
      console.log(`Using default rating: ${defaultRating}`);

      return defaultRating;
    } catch (error) {
      console.log("Error getting Google rating:", error);
      return 4.8; // Final fallback
    }
  }

  // Update statistics display
  function updateStatistics() {
    // Calculate business statistics
    const totalCars = calculateTotalCarsPurchased();
    const yearsExp = calculateYearsExperience();
    const googleRating = getGoogleRating();

    console.log(`Calculated Statistics:
        - Total Cars: ${totalCars.toLocaleString()}
        - Years Experience: ${yearsExp}
        - Google Rating: ${googleRating}
        - Customer Satisfaction: 100%`);

    // Update counter targets for animation
    const carsElement = document.getElementById("cars-purchased-total");
    const yearsElement = document.getElementById("years-experience");
    const ratingElement = document.getElementById("google-rating");

    if (carsElement) {
      carsElement.setAttribute("data-target", totalCars.toString());
      console.log(`Set cars target: ${totalCars}`);
    } else {
      console.error("Cars element not found!");
    }

    if (yearsElement) {
      yearsElement.setAttribute("data-target", yearsExp.toString());
      console.log(`Set years target: ${yearsExp}`);
    } else {
      console.error("Years element not found!");
    }

    if (ratingElement) {
      ratingElement.textContent = googleRating.toFixed(1);
      console.log(`Set rating: ${googleRating.toFixed(1)}`);
    } else {
      console.error("Rating element not found!");
    }

    // Store functions for admin access
    window._tsStats = {
      calculateTotalCarsPurchased,
      calculateYearsExperience,
      getGoogleRating,
      updateStatistics,
    };
  }

  // Initialize statistics immediately
  updateStatistics();

  // Expose admin functions to console for manual updates
  window.TwojSkup24Admin = {
    updateGoogleRating: function (newRating) {
      if (newRating >= 1 && newRating <= 5) {
        localStorage.setItem("_tss24_manual_rating", newRating.toString());
        localStorage.setItem("_tss24_google_rating", newRating.toString());
        localStorage.setItem(
          "_tss24_rating_time",
          new Date().getTime().toString()
        );
        console.log(`Google rating manually updated to: ${newRating}`);
        updateStatistics(); // Refresh display
        return true;
      } else {
        console.error("Rating must be between 1 and 5");
        return false;
      }
    },
    clearCache: function () {
      localStorage.removeItem("_tss24_google_rating");
      localStorage.removeItem("_tss24_rating_time");
      localStorage.removeItem("_tss24_manual_rating");
      console.log("All rating cache cleared");
      updateStatistics(); // Refresh with fresh data
    },
    getStatistics: function () {
      return {
        totalCars: calculateTotalCarsPurchased(),
        yearsExperience: calculateYearsExperience(),
        customerSatisfaction: CUSTOMER_SATISFACTION,
        companyFounded: COMPANY_FOUNDED_YEAR,
      };
    },
    refreshStatistics: function () {
      updateStatistics();
      console.log("Statistics refreshed");
    },
  };

  console.log("TwójSkup24 Admin Console Available:");
  console.log(
    "- TwojSkup24Admin.updateGoogleRating(4.9) - Update Google rating"
  );
  console.log("- TwojSkup24Admin.clearCache() - Clear rating cache");
  console.log("- TwojSkup24Admin.getStatistics() - Get current statistics");
  console.log("- TwojSkup24Admin.refreshStatistics() - Refresh display");
}

// Reviews Slider Implementation
function initReviewsSlider() {
  let currentSlide = 0;
  let reviewsData = [];
  let slidesPerView = 1;
  let autoSlideInterval;

  const slider = document.getElementById("reviews-slider");
  const track = document.getElementById("reviews-track");
  const prevBtn = document.getElementById("reviews-prev");
  const nextBtn = document.getElementById("reviews-next");
  const dotsContainer = document.getElementById("reviews-dots");
  const ratingElement = document.getElementById("reviews-rating");
  const countElement = document.getElementById("reviews-count");

  if (!slider || !track) {
    console.log("Reviews slider elements not found");
    return;
  }

  // Calculate slides per view based on screen size
  function calculateSlidesPerView() {
    const width = window.innerWidth;
    if (width >= 1024) return 2;
    return 1;
  }

  // Load reviews from JSON file
  async function loadReviews() {
    try {
      track.innerHTML =
        '<div class="reviews-loading">Ładowanie opinii...</div>';

      const response = await fetch("./reviews.json");
      if (!response.ok) {
        throw new Error("Failed to load reviews");
      }

      const data = await response.json();
      reviewsData = data.reviews;

      // Update header stats
      if (ratingElement && data.averageRating) {
        const stars = "★".repeat(5); // Always show 5 stars for visual consistency
        ratingElement.textContent = `${stars} ${data.averageRating}/5`;
      }

      if (countElement && data.totalReviews) {
        countElement.textContent = `(${data.totalReviews} opinii na Google)`;
      }

      displayReviews();
      createDots();
      updateSlider();
      startAutoSlide();

      console.log(`Loaded ${reviewsData.length} reviews successfully`);
    } catch (error) {
      console.error("Error loading reviews:", error);
      displayFallbackReviews();
    }
  }

  // Display fallback reviews if loading fails
  function displayFallbackReviews() {
    reviewsData = [
      {
        id: 1,
        author: "Marek K.",
        location: "Bydgoszcz",
        rating: 5,
        text: "Profesjonalna obsługa, uczciwe ceny i szybka realizacja. Polecam wszystkim!",
        date: "2025-09-20",
        verified: true,
      },
      {
        id: 2,
        author: "Anna N.",
        location: "Toruń",
        rating: 5,
        text: "Sprzedałam auto w 2 godziny! Przyjechali, sprawdzili i od razu zapłacili gotówką.",
        date: "2025-09-18",
        verified: true,
      },
      {
        id: 3,
        author: "Tomasz W.",
        location: "Inowrocław",
        rating: 5,
        text: "Najlepsza firma skupu w regionie. Konkurencyjne ceny i zero problemów z papierami.",
        date: "2025-09-15",
        verified: true,
      },
    ];

    displayReviews();
    createDots();
    updateSlider();
  }

  // Create review cards HTML
  function displayReviews() {
    const reviewsHTML = reviewsData
      .map((review) => {
        const stars = "★".repeat(review.rating);
        const reviewDate = new Date(review.date).toLocaleDateString("pl-PL", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return `
                <div class="review-card">
                    <div class="review-content">
                        <div class="review-stars">${stars}</div>
                        <div class="review-text">"${review.text}"</div>
                        <div class="review-author">
                            <div class="review-author-info">
                                <div class="review-author-name">${
                                  review.author
                                }</div>
                                <div class="review-author-location">${
                                  review.location
                                }</div>
                                <div class="review-date">${reviewDate}</div>
                            </div>
                            ${
                              review.verified
                                ? '<div class="review-verified">Zweryfikowana</div>'
                                : ""
                            }
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");

    track.innerHTML = reviewsHTML;
  }

  // Create navigation dots
  function createDots() {
    if (!dotsContainer) return;

    slidesPerView = calculateSlidesPerView();
    const totalSlides = Math.max(1, reviewsData.length - slidesPerView + 1);

    const dotsHTML = Array.from(
      { length: totalSlides },
      (_, i) =>
        `<button class="review-dot ${
          i === 0 ? "active" : ""
        }" data-slide="${i}"></button>`
    ).join("");

    dotsContainer.innerHTML = dotsHTML;

    // Add click events to dots
    dotsContainer.querySelectorAll(".review-dot").forEach((dot, index) => {
      dot.addEventListener("click", () => goToSlide(index));
    });
  }

  // Update slider position and navigation
  function updateSlider() {
    if (!track || reviewsData.length === 0) return;

    slidesPerView = calculateSlidesPerView();
    const maxSlide = Math.max(0, reviewsData.length - slidesPerView);
    currentSlide = Math.min(currentSlide, maxSlide);

    const translateX = -(currentSlide * (100 / slidesPerView));
    track.style.transform = `translateX(${translateX}%)`;

    // Update navigation buttons
    if (prevBtn) {
      prevBtn.disabled = currentSlide === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = currentSlide >= maxSlide;
    }

    // Update dots
    if (dotsContainer) {
      dotsContainer.querySelectorAll(".review-dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide);
      });
    }
  }

  // Navigation functions
  function nextSlide() {
    const maxSlide = Math.max(0, reviewsData.length - slidesPerView);
    if (currentSlide < maxSlide) {
      currentSlide++;
      updateSlider();
      resetAutoSlide();
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlider();
      resetAutoSlide();
    }
  }

  function goToSlide(slideIndex) {
    const maxSlide = Math.max(0, reviewsData.length - slidesPerView);
    currentSlide = Math.min(Math.max(0, slideIndex), maxSlide);
    updateSlider();
    resetAutoSlide();
  }

  // Auto-slide functionality
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      const maxSlide = Math.max(0, reviewsData.length - slidesPerView);
      if (currentSlide >= maxSlide) {
        currentSlide = 0;
      } else {
        currentSlide++;
      }
      updateSlider();
    }, 5000); // Change slide every 5 seconds
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener("click", prevSlide);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", nextSlide);
  }

  // Touch/swipe support for mobile
  let startX = 0;
  let isDragging = false;

  track.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      stopAutoSlide();
    },
    { passive: true }
  );

  track.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
    },
    { passive: false }
  );

  track.addEventListener(
    "touchend",
    (e) => {
      if (!isDragging) return;

      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > 50) {
        // Minimum swipe distance
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else {
        resetAutoSlide();
      }

      isDragging = false;
    },
    { passive: true }
  );

  // Handle window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createDots();
      updateSlider();
    }, 250);
  });

  // Pause auto-slide on hover
  if (slider) {
    slider.addEventListener("mouseenter", stopAutoSlide);
    slider.addEventListener("mouseleave", startAutoSlide);
  }

  // Initialize the slider
  loadReviews();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const href = this.getAttribute("href");
    if (href && href !== "#") {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});

// Phone number formatting
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.startsWith("48")) {
    value = value.substring(2);
  }

  value = value.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  input.value = value;
}

// Add phone formatting to all phone inputs
document.querySelectorAll('input[type="tel"]').forEach((input) => {
  input.addEventListener("input", function () {
    formatPhoneNumber(this);
  });
});

// Update copyright year dynamically
function updateCopyrightYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Performance monitoring
window.addEventListener("load", function () {
  updateCopyrightYear();
  // Log page load time
  const loadTime =
    performance.timing.loadEventEnd - performance.timing.navigationStart;
  console.log("Page load time:", loadTime + "ms");

  // Add loaded class to body for CSS animations
  document.body.classList.add("loaded");
});

// Footer: Cookie settings link handler
function initCookieSettingsLink() {
  const links = document.querySelectorAll(".cookie-settings-link");
  if (!links || links.length === 0) return;
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      try {
        const cm = window.consentManager || window.parent?.consentManager;
        if (cm) {
          // Ensure banner visible and open manage view
          cm.showBanner();
          setTimeout(() => {
            if (typeof cm.showManagePreferences === "function") {
              cm.showManagePreferences();
            }
          }, 0);
        } else {
          console.error("ConsentManager unavailable");
        }
      } catch (err) {
        console.error("Error opening consent settings:", err);
      }
    });
  });
}
