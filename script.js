const correctPassword = "<3";
const startDate = new Date("2025-01-22T00:00:00");

/* -------------------------
   LOGIN
-------------------------- */
function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === correctPassword) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-content").classList.remove("hidden");
    updateCounter();
    setInterval(updateCounter, 1000);
    loadFeelings();
  } else {
    document.getElementById("error").innerText = "Wrong password";
  }
}

/* -------------------------
   RELATIONSHIP COUNTER
-------------------------- */
function updateCounter() {
  const now = new Date();
  const diff = now - startDate;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  document.getElementById("days").innerText = days;
  document.getElementById("months").innerText = months;
  document.getElementById("extraDays").innerText = days % 30;
  document.getElementById("hours").innerText = hours % 24;
  document.getElementById("minutes").innerText = minutes % 60;
  document.getElementById("seconds").innerText = seconds % 60;
}

/* -------------------------
   SLIDER LIVE UPDATES
-------------------------- */
document.querySelectorAll(".slider").forEach(slider => {
  slider.addEventListener("input", () => {
    const valSpan = document.getElementById(slider.id + "-val");
    if (valSpan) valSpan.textContent = slider.value;
    updateHeart();
  });
});

/* -------------------------
   HEART REACTION
-------------------------- */
function updateHeart() {
  const youLoved = document.getElementById("you-loved").value;
  const herLoved = document.getElementById("her-loved").value;
  const avg = (Number(youLoved) + Number(herLoved)) / 2;

  const heart = document.getElementById("heart");

  // Pulse speed reacts to love
  const speed = Math.max(0.6, 2 - avg * 0.12);
  heart.style.animationDuration = speed + "s";

  // Color reacts to love
  heart.style.background = avg >= 7 ? "#ff3366" : "#b00040";
}

/* -------------------------
   SAVE / LOAD (LOCAL)
-------------------------- */
function saveYou() {
  const data = {
    loved: youLoved.value,
    energy: youEnergy.value,
    busy: youBusy.value,
    note: document.getElementById("you-note").value
  };

  localStorage.setItem("youData", JSON.stringify(data));
  document.getElementById("you-status").innerText = "Saved ♥";
}

function saveHer() {
  const data = {
    loved: herLoved.value,
    energy: herEnergy.value,
    busy: herBusy.value,
    note: document.getElementById("her-note").value
  };

  localStorage.setItem("herData", JSON.stringify(data));
  document.getElementById("her-status").innerText = "Saved ♥";
}

function loadFeelings() {
  const you = JSON.parse(localStorage.getItem("youData"));
  const her = JSON.parse(localStorage.getItem("herData"));

  if (you) {
    youLoved.value = you.loved;
    youEnergy.value = you.energy;
    youBusy.value = you.busy;
    document.getElementById("you-note").value = you.note;

    document.getElementById("you-loved-val").innerText = you.loved;
    document.getElementById("you-energy-val").innerText = you.energy;
    document.getElementById("you-busy-val").innerText = you.busy;
  }

  if (her) {
    herLoved.value = her.loved;
    herEnergy.value = her.energy;
    herBusy.value = her.busy;
    document.getElementById("her-note").value = her.note;

    document.getElementById("her-loved-val").innerText = her.loved;
    document.getElementById("her-energy-val").innerText = her.energy;
    document.getElementById("her-busy-val").innerText = her.busy;
  }

  updateHeart();
}
