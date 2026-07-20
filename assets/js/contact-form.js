(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var status = document.getElementById("contact-form-status");
    var submitBtn = form.querySelector('button[type="submit"]');
    var sendingText = submitBtn.textContent;

    function encode(data) {
      return Object.keys(data)
        .map(function (key) {
          return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
        })
        .join("&");
    }

    function setStatus(text, ok) {
      status.textContent = text;
      status.hidden = false;
      status.classList.toggle("form-status-error", !ok);
      status.classList.toggle("form-status-success", !!ok);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var data = {};
      new FormData(form).forEach(function (value, key) {
        data[key] = value;
      });

      submitBtn.disabled = true;
      submitBtn.textContent = form.dataset.sendingLabel || sendingText;
      status.hidden = true;

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(data),
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Network response was not ok");
          form.reset();
          setStatus(form.dataset.successLabel, true);
        })
        .catch(function () {
          setStatus(form.dataset.errorLabel, false);
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = sendingText;
        });
    });
  });
})();
