// Set your global launch date & time (UTC format recommended)
const launchDate = new Date("2026-02-01T18:00:00Z").getTime();
// مثال: Feb 1, 2026 — 6:00 PM
// Change this date anytime to reset countdown


const countdownEl = document.getElementById("countdown");

function updateCountdown() {
  const now = new Date().getTime();
  const distance = launchDate - now;

  if (distance <= 0) {
    countdownEl.textContent = "LAUNCHED 🚀";
    return;
  }

  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
  const displaySeconds = seconds < 10 ? "0" + seconds : seconds;

  countdownEl.textContent = `${displayMinutes}:${displaySeconds}`;
}

// Update every second
setInterval(updateCountdown, 1000);
updateCountdown();

function remindMe() {
  alert("You're on the reminder list (feature coming soon)");
}
