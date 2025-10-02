/**
 * Consent Mode v2 Manager - GDPR Compliant Cookie Consent
 * @version 1.0.0
 * @author TwójSkup24
 */

console.log("🚀 Consent manager script loaded successfully!");

class ConsentManager {
  constructor() {
    if (ConsentManager.instance) {
      return ConsentManager.instance;
    }

    this.config = {
      storageKey: "tskup24_consent",
      cookiePrefix: "tskup24_",
      validityDays: 180,
      policyVersion: "1.0",
      waitForUpdate: 2000,
      region: ["PL", "EEA"],
    };

    this.consentStatus = {
      ad_storage: false,
      ad_user_data: false,
      ad_personalization: false,
      analytics_storage: false,
      functionality_storage: false,
      personalization_storage: false,
      security_storage: false,
    };

    this.technicalCookiesWhitelist = [
      "tskup24_consent",
      "tskup24_session",
      "_csrf",
      "PHPSESSID",
      "connect.sid",
      "__cfduid",
    ];

    this.bannerVisible = false;
    this.scrollLocked = false;

    ConsentManager.instance = this;
    this.init();
  }

  /**
   * Initialize the consent manager
   */
  init() {
    console.log("🍪 ConsentManager v2 initializing...");
    this.initializeGoogleConsent();
    this.loadStoredConsents();
    this.createBannerUI();
    this.bindEvents();

    // Check if consent is already stored
    const hasStored = this.hasStoredConsent();
    console.log("🍪 Has stored consent:", hasStored);

    if (hasStored) {
      const stored = this.getStoredConsent();
      console.log("🍪 Stored consent data:", stored);
    }

    // Show banner if no consent stored
    if (!hasStored) {
      console.log("🍪 No consent found, showing banner.");
      this.showBanner();
    } else {
      console.log("🍪 Consent already exists, banner not shown");
      // Check if cookies are allowed and enable/disable features accordingly
      if (this.areCookiesAllowed()) {
        this.enableCookieDependentFeatures();
      } else {
        this.disableCookieDependentFeatures();
      }
    }

    console.log("🍪 ConsentManager v2 initialized successfully");
  }

  /**
   * Initialize Google Consent Mode v2 defaults
   */
  initializeGoogleConsent() {
    // Ensure gtag is available
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;

    // Set consent defaults before any tags load
    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted",
      wait_for_update: this.config.waitForUpdate,
      region: this.config.region,
    });
  }

  /**
   * Create the consent banner UI
   */
  createBannerUI() {
    const bannerHTML = `
            <div id="consent-banner" class="consent-banner" style="display: none;" role="dialog" aria-labelledby="consent-title" aria-describedby="consent-description">
                <div class="consent-overlay"></div>
                <div class="consent-modal">
                    <div class="consent-header">
                        <h2 id="consent-title">Zarządzanie prywatnością</h2>
                        <p id="consent-description">
                            Ta strona używa plików cookie i podobnych technologii w celach funkcjonalnych, 
                            analitycznych i reklamowych. Twoja zgoda jest dobrowolna i możesz ją wycofać w każdej chwili.
                            Szczegółowe informacje znajdziesz w naszej 
                            <a href="polityka-prywatnosci.html" target="_blank" style="color: #fbaf2e; text-decoration: underline;">Polityce Prywatności</a>.
                        </p>
                    </div>
                    
                    <div class="consent-details" id="consent-details" style="display: none;">
                        <div class="consent-category">
                            <label class="consent-switch">
                                <input type="checkbox" id="consent-security" checked>
                                <span class="slider"></span>
                                Niezbędne pliki cookie
                            </label>
                            <p class="consent-desc">Wymagane do prawidłowego działania strony</p>
                        </div>
                        
                        <div class="consent-category">
                            <label class="consent-switch">
                                <input type="checkbox" id="consent-analytics">
                                <span class="slider"></span>
                                Analityczne
                            </label>
                            <p class="consent-desc">Pomagają zrozumieć sposób korzystania ze strony</p>
                        </div>

                        <div class="consent-category">
                            <label class="consent-switch">
                                <input type="checkbox" id="consent-marketing">
                                <span class="slider"></span>
                                Zgoda marketingowa
                            </label>
                            <p class="consent-desc">Pozwala na śledzenie konwersji i personalizację treści</p>
                        </div>

                        <div class="consent-category">
                            <label class="consent-switch">
                                <input type="checkbox" id="consent-advertising">
                                <span class="slider"></span>
                                Reklamowe
                            </label>
                            <p class="consent-desc">Służą personalizacji reklam</p>
                        </div>
                        
                        <div class="consent-category">
                            <label class="consent-switch">
                                <input type="checkbox" id="consent-functional">
                                <span class="slider"></span>
                                Funkcjonalne
                            </label>
                            <p class="consent-desc">Umożliwiają dodatkowe funkcje strony</p>
                        </div>
                    </div>
                    
                    <div class="consent-buttons">
                        <button id="consent-accept-all" class="btn-accept-all" type="button">
                            Akceptuj wszystkie
                        </button>
                        <button id="consent-reject-all" class="btn-reject-all" type="button">
                            Odrzuć wszystkie
                        </button>
                        <button id="consent-manage" class="btn-manage" type="button">
                            Zarządzaj preferencjami
                        </button>
                        <button id="consent-save" class="btn-save" type="button" style="display: none;">
                            Zapisz wybór
                        </button>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", bannerHTML);
    this.injectConsentStyles();
  }

  /**
   * Inject consent banner styles
   */
  injectConsentStyles() {
    const styles = `
            .consent-banner {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .consent-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(2px);
            }
            
            .consent-modal {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            .consent-header h2 {
                margin: 0 0 12px 0;
                font-size: 20px;
                color: #000;
                font-weight: 600;
            }
            
            .consent-header p {
                margin: 0 0 20px 0;
                font-size: 14px;
                line-height: 1.5;
                color: #666;
            }
            
            .consent-category {
                margin: 16px 0;
                padding: 12px;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
            }
            
            .consent-switch {
                display: flex;
                align-items: center;
                cursor: pointer;
                font-weight: 500;
                margin-bottom: 4px;
            }
            
            .consent-switch input {
                display: none;
            }
            
            .slider {
                position: relative;
                display: inline-block;
                width: 44px;
                height: 24px;
                background-color: #ccc;
                border-radius: 24px;
                margin-right: 12px;
                transition: 0.3s;
            }
            
            .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                top: 3px;
                background-color: white;
                border-radius: 50%;
                transition: 0.3s;
            }
            
            .consent-switch input:checked + .slider {
                background-color: #fbaf2e;
            }
            
            .consent-switch input:checked + .slider:before {
                transform: translateX(20px);
            }
            
            .consent-desc {
                font-size: 12px;
                color: #888;
                margin: 4px 0 0 56px;
            }
            
            .consent-buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 24px;
            }
            
            .consent-buttons button {
                flex: 1;
                min-width: 120px;
                padding: 12px 16px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .consent-buttons button:focus {
                outline: 2px solid #fbaf2e;
                outline-offset: 2px;
            }
            
            .btn-accept-all {
                background: #fbaf2e;
                color: black;
            }
            
            .btn-accept-all:hover {
                background: #e09b1a;
            }
            
            .btn-reject-all {
                background: #AE2E2B;
                color: white;
            }
            
            .btn-reject-all:hover {
                background: #8a2421;
            }
            
            .btn-manage, .btn-save {
                background: #f8f9fa;
                color: #333;
                border: 1px solid #dee2e6;
            }
            
            .btn-manage:hover, .btn-save:hover {
                background: #e9ecef;
            }
            
            .consent-banner.scroll-lock {
                overflow: hidden;
            }
            
            @media (max-width: 768px) {
                .consent-modal {
                    margin: 20px;
                    width: calc(100% - 40px);
                    padding: 20px;
                }
                
                .consent-buttons button {
                    min-width: 100px;
                }
            }
        `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  /**
   * Bind event handlers
   */
  bindEvents() {
    const acceptAll = document.getElementById("consent-accept-all");
    const rejectAll = document.getElementById("consent-reject-all");
    const manage = document.getElementById("consent-manage");
    const save = document.getElementById("consent-save");

    acceptAll?.addEventListener("click", () => this.acceptAllConsents());
    rejectAll?.addEventListener("click", () => this.rejectAllConsents());
    manage?.addEventListener("click", () => this.showManagePreferences());
    save?.addEventListener("click", () => this.saveCustomConsents());
  }

  /**
   * Show the consent banner
   */
  showBanner() {
    const banner = document.getElementById("consent-banner");
    if (banner) {
      banner.style.display = "block";
      this.bannerVisible = true;
      this.lockPageScroll();

      // Focus management for accessibility
      this.setupFocusTrap();
      const acceptButton = document.getElementById("consent-accept-all");
      acceptButton?.focus();
    }
  }

  /**
   * Hide the consent banner
   */
  hideBanner() {
    const banner = document.getElementById("consent-banner");
    if (banner) {
      banner.style.display = "none";
      this.bannerVisible = false;
      this.unlockPageScroll();
    }
  }

  /**
   * Lock page scroll when banner is visible
   */
  lockPageScroll() {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    this.scrollLocked = true;
  }

  /**
   * Unlock page scroll
   */
  unlockPageScroll() {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    this.scrollLocked = false;
  }

  /**
   * Accept all consents
   */
  acceptAllConsents() {
    this.consentStatus = {
      ad_storage: true,
      ad_user_data: true,
      ad_personalization: true,
      analytics_storage: true,
      functionality_storage: true,
      personalization_storage: true,
      security_storage: false,
    };

    this.updateConsent();
    this.storeConsentDecision();
    this.hideBanner();
    this.fireConsentEvent("accept_all");

    // Update UI checkboxes
    document.getElementById("consent-analytics").checked = true;
    document.getElementById("consent-marketing").checked = true;
    document.getElementById("consent-advertising").checked = true;
    document.getElementById("consent-functional").checked = true;

    // Initialize Google Analytics after consent is granted
    this.initializeGoogleAnalytics();

    // Enable functionality that requires cookies
    this.enableCookieDependentFeatures();
  }

  /**
   * Reject all consents (except essential)
   */
  rejectAllConsents() {
    this.consentStatus = {
      ad_storage: false,
      ad_user_data: false,
      ad_personalization: false,
      analytics_storage: false,
      functionality_storage: false,
      personalization_storage: false,
      security_storage: false,
    };

    this.updateConsent();
    this.blockCookies();
    this.cleanExistingCookies();
    this.storeConsentDecision();
    this.hideBanner();
    this.fireConsentEvent("reject_all");

    // Update UI checkboxes
    document.getElementById("consent-analytics").checked = false;
    document.getElementById("consent-marketing").checked = false;
    document.getElementById("consent-advertising").checked = false;
    document.getElementById("consent-functional").checked = false;

    // Disable functionality that requires cookies
    this.disableCookieDependentFeatures();
  }

  /**
   * Check if cookies are allowed for functionality
   */
  areCookiesAllowed() {
    return (
      this.hasStoredConsent() &&
      (this.consentStatus.functionality_storage ||
        this.consentStatus.analytics_storage ||
        this.consentStatus.security_storage)
    );
  }

  /**
   * Enable features that require cookies
   */
  enableCookieDependentFeatures() {
    // Remove any cookie restriction overlays
    const overlays = document.querySelectorAll(".cookie-restriction-overlay");
    overlays.forEach((overlay) => overlay.remove());

    // Enable form functionality
    const calculatorForm = document.getElementById("pricing-form");
    if (calculatorForm) {
      calculatorForm.style.opacity = "1";
      calculatorForm.style.pointerEvents = "auto";
    }

    console.log("Cookie-dependent features enabled");
  }

  /**
   * Disable features that require cookies
   */
  disableCookieDependentFeatures() {
    // Add restriction overlay to calculator
    this.addCookieRestrictionOverlay();

    console.log("Cookie-dependent features disabled");
  }

  /**
   * Add cookie restriction overlay to forms
   */
  addCookieRestrictionOverlay() {
    // Remove existing overlays first
    const existingOverlays = document.querySelectorAll(
      ".cookie-restriction-overlay"
    );
    existingOverlays.forEach((overlay) => overlay.remove());

    // Add overlay to calculator form
    const calculatorSection = document.getElementById("wycena");
    if (calculatorSection) {
      const overlay = document.createElement("div");
      overlay.className = "cookie-restriction-overlay";
      overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                font-size: 18px;
                text-align: center;
                padding: 20px;
            `;

      const content = document.createElement("div");
      content.innerHTML = `
                <h3 style="margin: 0 0 15px 0; color: #fbaf2e;">🍪 Wymagane pliki cookie</h3>
                <p style="margin: 0 0 20px 0;">Aby korzystać z kalkulatora wyceny, zaakceptuj pliki cookie.</p>
                <button onclick="window.consentManager?.showBanner?.()"
                        style="background: #fbaf2e; color: black; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    Zarządzaj zgodami
                </button>
            `;

      overlay.appendChild(content);
      calculatorSection.style.position = "relative";
      calculatorSection.appendChild(overlay);
    }

    // Disable form submission
    const calculatorForm = document.getElementById("pricing-form");
    if (calculatorForm) {
      calculatorForm.style.opacity = "0.5";
      calculatorForm.style.pointerEvents = "none";
    }
  }

  /**
   * Show manage preferences view
   */
  showManagePreferences() {
    const details = document.getElementById("consent-details");
    const manage = document.getElementById("consent-manage");
    const save = document.getElementById("consent-save");

    if (details && manage && save) {
      details.style.display = "block";
      manage.style.display = "none";
      save.style.display = "inline-block";
    }

    this.loadCurrentPreferences();
  }

  /**
   * Load current preferences into the UI
   */
  loadCurrentPreferences() {
    const stored = this.getStoredConsent();
    if (stored) {
      document.getElementById("consent-analytics").checked =
        stored.consents.analytics_storage;
      document.getElementById("consent-marketing").checked =
        stored.consents.analytics_storage; // Marketing controls GA4
      document.getElementById("consent-advertising").checked =
        stored.consents.ad_storage;
      document.getElementById("consent-functional").checked =
        stored.consents.functionality_storage;
    }
  }

  /**
   * Save custom consent preferences
   */
  saveCustomConsents() {
    const marketingConsent =
      document.getElementById("consent-marketing")?.checked || false;

    this.consentStatus = {
      ad_storage:
        document.getElementById("consent-advertising")?.checked || false,
      ad_user_data:
        document.getElementById("consent-advertising")?.checked || false,
      ad_personalization:
        document.getElementById("consent-advertising")?.checked || false,
      analytics_storage: marketingConsent, // Marketing agreement controls GA4
      functionality_storage:
        document.getElementById("consent-functional")?.checked || false,
      personalization_storage:
        document.getElementById("consent-functional")?.checked || false,
      security_storage:
        document.getElementById("consent-security")?.checked || false,
    };

    this.updateConsent();

    if (!this.hasAnyConsentGranted()) {
      this.blockCookies();
      this.cleanExistingCookies();
    } else if (this.consentStatus.analytics_storage) {
      this.initializeGoogleAnalytics();
    }

    this.storeConsentDecision();
    this.hideBanner();
    this.fireConsentEvent("custom_consent");

    // Update marketing checkbox to reflect analytics_storage state
    document.getElementById("consent-marketing").checked =
      this.consentStatus.analytics_storage;

    // Enable/disable features based on final consent state
    if (this.areCookiesAllowed()) {
      this.enableCookieDependentFeatures();
    } else {
      this.disableCookieDependentFeatures();
    }
  }

  /**
   * Update Google Consent Mode
   */
  updateConsent() {
    if (typeof gtag !== "undefined") {
      gtag("consent", "update", {
        ad_storage: this.consentStatus.ad_storage ? "granted" : "denied",
        ad_user_data: this.consentStatus.ad_user_data ? "granted" : "denied",
        ad_personalization: this.consentStatus.ad_personalization
          ? "granted"
          : "denied",
        analytics_storage: this.consentStatus.analytics_storage
          ? "granted"
          : "denied",
        functionality_storage: this.consentStatus.functionality_storage
          ? "granted"
          : "denied",
        personalization_storage: this.consentStatus.personalization_storage
          ? "granted"
          : "denied",
        security_storage: "granted",
      });
    }
  }

  /**
   * Revoke all consents
   */
  revokeConsent() {
    this.consentStatus = {
      ad_storage: false,
      ad_user_data: false,
      ad_personalization: false,
      analytics_storage: false,
      functionality_storage: false,
      personalization_storage: false,
      security_storage: false,
    };

    this.updateConsent();
    this.blockCookies();
    this.cleanExistingCookies();
    this.removeStoredConsent();
    this.fireConsentEvent("revoke_consent");
  }

  /**
   * Get current consent status
   */
  getConsentStatus() {
    return { ...this.consentStatus };
  }

  /**
   * Block cookies actively
   */
  blockCookies() {
    const self = this;

    // Override document.cookie setter to block non-essential cookies
    const originalCookieDescriptor =
      Object.getOwnPropertyDescriptor(Document.prototype, "cookie") ||
      Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "cookie");

    if (originalCookieDescriptor && originalCookieDescriptor.configurable) {
      Object.defineProperty(document, "cookie", {
        get() {
          return originalCookieDescriptor.get.call(this);
        },
        set(value) {
          const cookieName = value.split("=")[0].trim();
          if (self.isEssentialCookie(cookieName)) {
            return originalCookieDescriptor.set.call(this, value);
          }
          console.warn("Cookie blocked:", cookieName);
          return false;
        },
        configurable: true,
      });
    }

    this.cookieBlocked = true;
  }

  /**
   * Check if cookie is essential
   */
  isEssentialCookie(cookieName) {
    return this.technicalCookiesWhitelist.some(
      (pattern) =>
        cookieName.includes(pattern) || cookieName.match(new RegExp(pattern))
    );
  }

  /**
   * Clean existing cookies
   */
  cleanExistingCookies() {
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (name && !this.isEssentialCookie(name)) {
        // Remove cookie from current domain and path
        const paths = ["/", "/assets/js/", "/assets/css/", "/assets/"];
        const domains = [
          "",
          `; domain=${window.location.hostname}`,
          `; domain=.${window.location.hostname}`,
          `; domain=.${window.location.hostname
            .split(".")
            .slice(-2)
            .join(".")}`,
        ];

        paths.forEach((path) => {
          domains.forEach((domain) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain}; secure;`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain};`;
          });
        });

        console.log("Cleaned non-essential cookie:", name);
      }
    });
  }

  /**
   * Store consent decision
   */
  storeConsentDecision() {
    const consentData = {
      consents: this.consentStatus,
      timestamp: Date.now(),
      version: this.config.policyVersion,
      expires: Date.now() + this.config.validityDays * 24 * 60 * 60 * 1000,
    };

    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(consentData));
    } catch (e) {
      // Fallback to cookie if localStorage is not available
      const cookieValue = encodeURIComponent(JSON.stringify(consentData));
      document.cookie = `${
        this.config.storageKey
      }=${cookieValue}; expires=${new Date(
        consentData.expires
      ).toUTCString()}; path=/; secure; samesite=lax`;
    }
  }

  /**
   * Load stored consents
   */
  loadStoredConsents() {
    const stored = this.getStoredConsent();
    if (stored && stored.expires > Date.now()) {
      this.consentStatus = stored.consents;
      this.updateConsent();

      // Initialize analytics if consent was previously granted
      if (this.consentStatus.analytics_storage) {
        this.initializeGoogleAnalytics();
      }
    } else if (stored && stored.expires <= Date.now()) {
      // Consent expired, clean up and show banner
      this.removeStoredConsent();
      this.cleanExistingCookies();
    }

    // Clean existing cookies on first load if no consent
    if (!this.hasStoredConsent()) {
      this.cleanExistingCookies();
    }
  }

  /**
   * Get stored consent
   */
  getStoredConsent() {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // Fallback to cookie
      const cookies = document.cookie.split(";");
      const consentCookie = cookies.find((cookie) =>
        cookie.trim().startsWith(this.config.storageKey)
      );
      if (consentCookie) {
        const value = decodeURIComponent(consentCookie.split("=")[1]);
        return JSON.parse(value);
      }
    }
    return null;
  }

  /**
   * Check if consent is stored
   */
  hasStoredConsent() {
    const stored = this.getStoredConsent();
    return stored && stored.expires > Date.now();
  }

  /**
   * Remove stored consent
   */
  removeStoredConsent() {
    try {
      localStorage.removeItem(this.config.storageKey);
    } catch (e) {
      document.cookie = `${this.config.storageKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    }
  }

  /**
   * Check if any consent is granted
   */
  hasAnyConsentGranted() {
    return Object.entries(this.consentStatus)
      .filter(([key]) => key !== "security_storage")
      .some(([, value]) => value === true);
  }

  /**
   * Setup focus trap for accessibility
   */
  setupFocusTrap() {
    const modal = document.querySelector(".consent-modal");
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    modal.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }

      if (e.key === "Escape") {
        // Prevent closing without choice - just focus first button
        firstFocusable.focus();
      }
    });
  }

  /**
   * Fire consent event to dataLayer
   */
  fireConsentEvent(action) {
    // Push to GTM dataLayer
    if (typeof gtag !== "undefined") {
      gtag("event", "consent_update", {
        consent_action: action,
        ad_storage: this.consentStatus.ad_storage ? "granted" : "denied",
        analytics_storage: this.consentStatus.analytics_storage
          ? "granted"
          : "denied",
        functionality_storage: this.consentStatus.functionality_storage
          ? "granted"
          : "denied",
        personalization_storage: this.consentStatus.personalization_storage
          ? "granted"
          : "denied",
      });
    }

    // Also push directly to dataLayer for GTM
    if (typeof dataLayer !== "undefined") {
      dataLayer.push({
        event: "consent_update",
        consent_action: action,
        consent_status: this.consentStatus,
      });
    }

    // Custom event for other integrations
    const event = new CustomEvent("consentChanged", {
      detail: {
        action: action,
        consents: this.consentStatus,
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Public helper functions for external access
   */
  updateConsentAPI() {
    this.updateConsent();
  }

  revokeConsentAPI() {
    this.revokeConsent();
  }

  getConsentStatusAPI() {
    return this.getConsentStatus();
  }

  blockCookiesAPI() {
    this.blockCookies();
  }

  cleanExistingCookiesAPI() {
    this.cleanExistingCookies();
  }

  /**
   * Check if consent has expired and needs renewal
   */
  checkConsentExpiry() {
    const stored = this.getStoredConsent();
    if (stored && stored.expires <= Date.now()) {
      this.removeStoredConsent();
      if (!this.bannerVisible) {
        this.showBanner();
      }
      return true;
    }
    return false;
  }

  /**
   * Public API for external access
   */
  static getInstance() {
    if (!ConsentManager.instance) {
      new ConsentManager();
    }
    return ConsentManager.instance;
  }

  /**
   * Public method to check if cookies are allowed
   */
  static areCookiesAllowed() {
    const instance = ConsentManager.getInstance();
    return instance.areCookiesAllowed();
  }

  /**
   * Initialize Google Analytics after consent is granted
   */
  initializeGoogleAnalytics() {
    if (typeof gtag === "undefined") {
      // Load Google Analytics script
      const gaScript = document.createElement("script");
      gaScript.async = true;
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX";
      document.head.appendChild(gaScript);

      gaScript.onload = () => {
        gtag("js", new Date());
        gtag("config", "G-XXXXXXXXXX", {
          anonymize_ip: true,
          allow_google_signals: true,
          cookie_flags: "secure;samesite=lax",
        });
      };

      console.log("Google Analytics initialized with consent");
    }
  }
}

// Create and export singleton instance
const consentManager = new ConsentManager();

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    consentManager.checkConsentExpiry();
  });
} else {
  consentManager.checkConsentExpiry();
}

// Make available globally for backwards compatibility
window.consentManager = consentManager;

// Global function to manually clear consent and show banner (for testing)
window.clearConsentForTesting = function () {
  try {
    localStorage.removeItem("tskup24_consent");
    // Also clear any cookies
    document.cookie =
      "tskup24_consent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure;";
    document.cookie =
      "tskup24_consent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    console.log("🧹 Consent data cleared! Reloading page...");
    location.reload();
  } catch (e) {
    console.error("Error clearing consent:", e);
  }
};

// Global function to manually show consent banner (for testing)
window.showConsentBannerForTesting = function () {
  if (window.consentManager) {
    console.log("🍪 Manually showing consent banner...");
    window.consentManager.showBanner();
  } else {
    console.error("ConsentManager not available");
  }
};

console.log("🔧 Testing functions available:");
console.log("- clearConsentForTesting() - Clear stored consent and reload");
console.log("- showConsentBannerForTesting() - Force show banner");
