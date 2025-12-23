const correctPassword = "<3";

// IMPORTANT: January = 0
const startDate = new Date(2025, 0, 22, 0, 0, 0);

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: "PASTE_YOURS",
  authDomain: "PASTE_YOURS",
  projectId: "PASTE_YOURS",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ================= LOGIN ================= */
function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === correctPassword) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-content").classList.remove("hidden");
    updateCounter();
    setInterval(updateCounter, 1000);
    loadData();
  } else {
    document.getElementById("error").innerText = "Wrong password";
  }
}

/* ================= COUNTER ================= */
function updateCounter() {
  const now = new Date();

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();
  let hours = now.getHours() - startDate.getHours();
  let minutes = now.getMinutes() - startDate.getMinutes();
  let seconds = now.getSeconds() - startDate.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }

  if (days < 0) {
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
    months--;
  }

  if (months < 0) { months += 12; years--; }

  document.getElementById("years").innerText = years;
  document.getElementById("months").innerText = months;
  document.getElementById("days").innerText =
    Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  document.getElementById("daysSmall").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;
}

/* ================= SLIDERS ================= */
document.querySelectorAll(".slider").forEach(slider => {
  slider.addEventListener("input", () => {
    document.getElementById(slider.id + "-val").innerText = slider.value;
    updateHeart();
  });
});

/* ================= HEART ================= */
function updateHeart() {
  const avg =
    (Number(youLoved.value) + Number(herLoved.value)) / 2;
  const heart = document.getElementById("heart");

  heart.style.animationDuration = Math.max(0.6, 2 - avg * 0.12) + "s";
  heart.style.background = avg >= 7 ? "#ff3366" : "#b00040";
}

/* ================= SAVE / LOAD ================= */
function saveYou() {
  db.collection("daily").doc("you").set({
    loved: youLoved.value,
    energy: youEnergy.value,
    busy: youBusy.value,
    note: youNote.value,
    time: Date.now()
  }).then(showToast);
}

function saveHer() {
  db.collection("daily").doc("her").set({
    loved: herLoved.value,
    energy: herEnergy.value,
    busy: herBusy.value,
    note: herNote.value,
    time: Date.now()
  }).then(showToast);
}

function loadData() {
  db.collection("daily").doc("you").get().then(doc => {
    if (doc.exists) {
      const d = doc.data();
      youLoved.value = d.loved;
      youEnergy.value = d.energy;
      youBusy.value = d.busy;
      youNote.value = d.note;
      updateSliders("you");
    }
  });

  db.collection("daily").doc("her").get().then(doc => {
    if (doc.exists) {
      const d = doc.data();
      herLoved.value = d.loved;
      herEnergy.value = d.energy;
      herBusy.value = d.busy;
      herNote.value = d.note;
      updateSliders("her");
    }
  });
}

function updateSliders(who) {
  ["loved","energy","busy"].forEach(t => {
    document.getElementById(`${who}-${t}-val`).innerText =
      document.getElementById(`${who}-${t}`).value;
  });
  updateHeart();
}

/* ================= TOAST ================= */
function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
}
