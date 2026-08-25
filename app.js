document.addEventListener("DOMContentLoaded", () => {
  // Preserved Floating Audio Player Logic
  const audio = document.getElementById("weddingAudio");
  const audioToggleBtn = document.getElementById("audioToggleBtn");
  const audioBtnText = document.getElementById("audioBtnText");
  const equalizerWaves = document.getElementById("equalizerWaves");
  const heroPlayBtn = document.getElementById("heroPlayBtn");

  let isPlaying = false;

  function toggleAudio() {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      audioBtnText.textContent = "Вкл. музыку";
      equalizerWaves.classList.add("hidden");
    } else {
      audio.play().then(() => {
        isPlaying = true;
        audioBtnText.textContent = "Выкл. музыку";
        equalizerWaves.classList.remove("hidden");
      }).catch(err => {
        console.log("Audio play deferred to user gesture", err);
      });
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener("click", toggleAudio);
  }

  const musicToggleBtn = document.getElementById("musicToggleBtn");
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", toggleAudio);
  }

  if (heroPlayBtn) {
    heroPlayBtn.addEventListener("click", () => {
      if (!isPlaying) {
        toggleAudio();
      }
    });
  }

  // General scroll observer for block sections: triggers strictly when element enters visible screen
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -40px 0px",
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".scroll-reveal").forEach(el => {
    observer.observe(el);
  });

  // Dedicated IntersectionObserver watching all transition wave lines (.transition-wave-line)
  const waveLineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        waveLineObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: "0px 0px -40px 0px",
    threshold: 0.05
  });

  document.querySelectorAll(".transition-wave-line").forEach(line => {
    waveLineObserver.observe(line);
  });

  // Preserved RSVP Form Logic - Open on click on 26.svg image or card wrapper
  const openRsvpBtn = document.getElementById("openRsvpBtn");
  const rsvpForm = document.getElementById("rsvpForm");
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const plusOneGroup = document.getElementById("plusOneGroup");
  const rsvpSuccess = document.getElementById("rsvpSuccess");

  if (rsvpForm && openRsvpBtn) {
    openRsvpBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      rsvpForm.classList.toggle("hidden");
      if (!rsvpForm.classList.contains("hidden")) {
        rsvpForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  attendanceRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      if (plusOneGroup) {
        if (e.target.value === "couple") {
          plusOneGroup.classList.remove("hidden");
        } else {
          plusOneGroup.classList.add("hidden");
        }
      }
    });
  });

  // Configurable Google Sheets / Webhook Script URL
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxNxWv0uHMUSUnc4LTEa-sfLq7rjGTMc2h1maoblD-1KVKp6NL_J0N1VgUFhnPsLPk/exec";

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = rsvpForm.querySelector(".rsvp-submit-btn");
      if (submitBtn) submitBtn.disabled = true;

      const formData = {
        guestName: document.getElementById("guestName")?.value || "",
        attendance: document.querySelector('input[name="attendance"]:checked')?.value || "",
        partnerName: document.getElementById("partnerName")?.value || "",
        drinks: Array.from(document.querySelectorAll('input[name="drinks"]:checked')).map(cb => cb.value)
      };

      // Translate attendance key to readable Russian text
      const attendanceTextMap = {
        yes: "Я приду",
        couple: "Буду с парой",
        no: "К сожалению, не смогу"
      };
      formData.attendanceText = attendanceTextMap[formData.attendance] || formData.attendance;

      if (GOOGLE_SHEET_URL) {
        try {
          await fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
          });
        } catch (err) {
          console.error("Error sending RSVP to Google Sheets:", err);
        }
      }

      if (rsvpSuccess) {
        rsvpSuccess.classList.remove("hidden");
        setTimeout(() => {
          rsvpForm.reset();
          rsvpSuccess.classList.add("hidden");
          rsvpForm.classList.add("hidden");
          if (submitBtn) submitBtn.disabled = false;
        }, 3000);
      }
    });
  }

  // Ensure full page height is recalculated on initial load for proper scrollbar thumb sizing
  window.addEventListener("load", () => {
    window.dispatchEvent(new Event("resize"));
    document.querySelectorAll(".scroll-reveal").forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add("active");
      }
    });
  });
});
