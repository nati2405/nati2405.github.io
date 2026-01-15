// ===== OWNER CONTROLS GLOBAL LAUNCH TIME =====
const launchDate = new Date("2026-02-01T18:00:00Z").getTime();
// Change this date/time to control countdown globally

const countdownEl = document.getElementById("countdown");

function updateCountdown() {
  const now = new Date().getTime();
  const distance = launchDate - now;

  if (distance <= 0) {
    countdownEl.textContent = "LAUNCHED 🚀";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((distance % (1000*60)) / 1000);

  const d = days < 10 ? "0" + days : days;
  const h = hours < 10 ? "0" + hours : hours;
  const m = minutes < 10 ? "0" + minutes : minutes;
  const s = seconds < 10 ? "0" + seconds : seconds;

  countdownEl.innerHTML = `${d}<span>Days</span> : ${h}:${m}:${s}`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Reminder button
function remindMe() {
  alert("You're on the reminder list 😉");
}

// Back button → change to your main page filename
function goBack() {
  window.location.href = "../index.html";
}

