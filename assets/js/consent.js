(function () {
  "use strict";

  var STORAGE_KEY = "almas_cookie_consent";
  var CONSENT_VERSION = 1;
  var CONSENT_MAX_AGE_DAYS = 365;

  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data.v !== CONSENT_VERSION) return null;
      var ageDays = (Date.now() - data.ts) / 86400000;
      if (ageDays > CONSENT_MAX_AGE_DAYS) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(categories) {
    var data = { v: CONSENT_VERSION, ts: Date.now(), categories: categories };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
    return data;
  }

  function deleteCookie(name) {
    document.cookie = name + "=; Max-Age=0; path=/";
    document.cookie = name + "=; Max-Age=0; path=/; domain=" + location.hostname;
  }

  function purgeAnalyticsCookies() {
    ["_ga", "_gid", "_gat"].forEach(deleteCookie);
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (/^_ga_/.test(name)) deleteCookie(name);
    });
  }

  function loadAnalytics() {
    var gaId = document.documentElement.getAttribute("data-ga-id");
    if (!gaId || window.__gaLoaded) return;
    window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaId, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaId);
    document.head.appendChild(s);
  }

  function applyConsent(consent) {
    if (consent && consent.categories && consent.categories.analytics) {
      loadAnalytics();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var banner = document.getElementById("cookie-banner");
    if (!banner) return;
    var panel = document.getElementById("cookie-panel");
    var saveBtn = document.querySelector("[data-cookie-save]");
    var analyticsToggle = document.getElementById("cookie-analytics-toggle");

    var existing = readConsent();
    if (existing) {
      applyConsent(existing);
    } else {
      banner.hidden = false;
    }

    function openBanner(consent) {
      if (analyticsToggle) {
        analyticsToggle.checked = !!(consent && consent.categories && consent.categories.analytics);
      }
      panel.hidden = true;
      saveBtn.hidden = true;
      banner.hidden = false;
    }

    function closeBanner() {
      banner.hidden = true;
    }

    function acceptAll() {
      var consent = writeConsent({ necessary: true, analytics: true });
      applyConsent(consent);
      closeBanner();
    }

    function rejectAll() {
      purgeAnalyticsCookies();
      writeConsent({ necessary: true, analytics: false });
      closeBanner();
    }

    function saveCustom() {
      var analytics = !!(analyticsToggle && analyticsToggle.checked);
      var consent = writeConsent({ necessary: true, analytics: analytics });
      if (analytics) {
        applyConsent(consent);
      } else {
        purgeAnalyticsCookies();
      }
      closeBanner();
    }

    document.querySelectorAll("[data-cookie-accept]").forEach(function (b) {
      b.addEventListener("click", acceptAll);
    });
    document.querySelectorAll("[data-cookie-reject]").forEach(function (b) {
      b.addEventListener("click", rejectAll);
    });
    document.querySelectorAll("[data-cookie-save]").forEach(function (b) {
      b.addEventListener("click", saveCustom);
    });
    document.querySelectorAll("[data-cookie-customize]").forEach(function (b) {
      b.addEventListener("click", function () {
        var open = panel.hidden;
        panel.hidden = !open;
        saveBtn.hidden = !open;
      });
    });
    document.querySelectorAll("[data-cookie-reopen]").forEach(function (b) {
      b.addEventListener("click", function (ev) {
        ev.preventDefault();
        openBanner(readConsent());
      });
    });
  });
})();
