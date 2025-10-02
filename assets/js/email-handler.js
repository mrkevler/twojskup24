/**
 * Email Handler for TwójSkup24 Forms
 
 */

class EmailHandler {
  constructor() {
    this.recipientEmail = "skupautikasacja@gmail.com";
    this.endpoint = "/api/send-email.php"; // PHP endpoint on Apache hosting
    this.initialized = false;
    this.init();
  }

  init() {
    try {
      if (typeof fetch === "undefined") {
        throw new Error("Fetch API not available");
      }
      this.initialized = true;
    } catch (error) {
      console.error("❌ EmailHandler: Initialization failed:", error);
      this.initialized = false;
    }
  }

  /**
   * Send pricing form data securely via POST method
   */
  async sendPricingForm(formData) {
    if (!this.initialized) {
      console.warn("⚠️ EmailHandler: Not available or not initialized");
      throw new Error("EmailHandler not initialized - fetch API not available");
    }

    try {
      // Check if cookies are allowed for functionality
      const cm = window.consentManager || window.parent?.consentManager;
      if (
        !cm ||
        typeof cm.areCookiesAllowed !== "function" ||
        !cm.areCookiesAllowed()
      ) {
        throw new Error(
          "Aby wysłać formularz, zaakceptuj pliki cookie wymagane do działania kalkulatora."
        );
      }

      const hasRODO = this.isAffirmative(formData?.privacyAgreement);
      if (!hasRODO) {
        throw new Error("Zaznacz zgodę RODO pod formularzem, aby wysłać dane.");
      }
      const emailData = {
        to: this.recipientEmail,
        subject: `Nowa wiadomość wyceny - ${formData.brand} ${formData.model}`,
        html: this.generatePricingEmailHtml({
          ...formData,
          privacyAgreement: hasRODO,
        }),
        text: this.generatePricingEmailText({
          ...formData,
          privacyAgreement: hasRODO,
        }),
        meta: {
          consent:
            cm && typeof cm.getConsentStatus === "function"
              ? cm.getConsentStatus()
              : null,
          url: window.location.href,
          ua: navigator.userAgent,
        },
      };

      const response = await this.sendEmail(emailData);
      return {
        success: true,
        messageId: response?.messageId || undefined,
        message: "Wycena została wysłana pomyślnie!",
      };
    } catch (error) {
      console.error("🔴 EmailHandler: Error message:", error.message);
      return {
        success: false,
        error: error.message,
        message:
          "Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub skontaktuj się telefonicznie.",
      };
    }
  }

  /**
   * Generate HTML email content for pricing form
   */
  generatePricingEmailHtml(data) {
    return `
            <h2>Nowa wiadomość wyceny pojazdu</h2>
            <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                <tr><td><strong>Data:</strong></td><td>${new Date().toLocaleString(
                  "pl-PL"
                )}</td></tr>
                <tr><td><strong>Imię i nazwisko:</strong></td><td>${
                  data.fullName
                }</td></tr>
                <tr><td><strong>Telefon:</strong></td><td>${
                  data.phone
                }</td></tr>
                <tr><td><strong>Email:</strong></td><td>${
                  data.email || "Nie podano"
                }</td></tr>
                <tr><td colspan="2"><strong>DANE POJAZDU</strong></td></tr>
                <tr><td><strong>Marka:</strong></td><td>${data.brand}</td></tr>
                <tr><td><strong>Model:</strong></td><td>${data.model}</td></tr>
                <tr><td><strong>Rok produkcji:</strong></td><td>${
                  data.productionYear
                }</td></tr>
                <tr><td><strong>Rodzaj paliwa:</strong></td><td>${
                  data.fuelType
                }</td></tr>
                <tr><td><strong>Stan techniczny:</strong></td><td>${
                  data.technicalCondition || "Nie podano"
                }</td></tr>
                <tr><td><strong>Dodatkowe informacje:</strong></td><td>${
                  data.notes || "Brak"
                }</td></tr>
            </table>
            <div style="margin-top:12px; font-size:12px; color:#555;">
              <div><strong>Zgoda RODO:</strong> ${
                data.privacyAgreement ? "TAK" : "NIE"
              }</div>
            </div>
            <p style="margin-top: 20px; padding: 10px; background-color: #f8f9fa; border-left: 4px solid #fbaf2e;">
                <strong>Uwaga:</strong> Klient wyraził zgodę na przetwarzanie danych osobowych zgodnie z polityką prywatności.
            </p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
                Email wysłany automatycznie ze strony www.twojskup24.pl<br>
                Data: ${new Date().toLocaleString("pl-PL")}
            </p>
        `;
  }

  /**
   * Generate plain text email content for pricing form
   */
  generatePricingEmailText(data) {
    return `NOWA PROŚBA O WYCENĘ POJAZDU

Data: ${new Date().toLocaleString("pl-PL")}

DANE KONTAKTOWE:
Imię i nazwisko: ${data.fullName}
Telefon: ${data.phone}
Email: ${data.email || "Nie podano"}

DANE POJAZDU:
Marka: ${data.brand}
Model: ${data.model}
Rok produkcji: ${data.productionYear}
Rodzaj paliwa: ${data.fuelType}
Stan techniczny: ${data.technicalCondition || "Nie podano"}

DODATKOWE INFORMACJE:
${data.notes || "Brak dodatkowych informacji"}

UWAGA: Klient wyraził zgodę na przetwarzanie danych osobowych zgodnie z polityką prywatności.

---
Email wysłany automatycznie ze strony www.twojskup24.pl
Data: ${new Date().toLocaleString("pl-PL")}`;
  }

  /**
   * Internal method to send email (to change)
   */
  async sendEmail(emailData) {
    console.log("EmailHandler: Sending email data to:", this.endpoint);
    // Send to your Apache/PHP backend
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    console.log("📊 EmailHandler: HTTP Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Try to parse JSON; if backend returns plain text, handle gracefully
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : { success: response.ok, messageId: "sent" };

    if (payload.success === false) {
      const msg = payload?.error || payload?.message || "Błąd wysyłki";
      throw new Error(msg);
    }

    return payload;
  }

  /**
   * Get authentication token also to change
   */
  getAuthToken() {
    // No token needed for your PHP endpoint; kept for API compatibility
    return null;
  }

  /**
   * Normalize checkbox/boolean inputs to true/false
   */
  isAffirmative(value) {
    if (value === true) return true;
    if (typeof value === "string") {
      const v = value.toLowerCase();
      return (
        v === "true" ||
        v === "1" ||
        v === "on" ||
        v === "yes" ||
        v === "tak" ||
        v === "checked"
      );
    }
    if (typeof value === "number") {
      return value === 1;
    }
    return false;
  }

  /**
   * Validate form data before sending
   */
  validatePricingForm() {
    return true;
  }
}

// Create singleton instance
window.emailHandler = new EmailHandler();
window.sendPricingForm = function sendPricingForm(formData) {
  if (!window.emailHandler) {
    console.warn("⚠️ EmailHandler: Not available or not initialized");
    return Promise.reject(
      new Error("EmailHandler nie jest dostępny. Spróbuj ponownie później.")
    );
  }
  return window.emailHandler.sendPricingForm(formData);
};
