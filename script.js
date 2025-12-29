// FIREBASE CONFIG
const firebaseConfig = {

  apiKey: "AIzaSyDH8rZPpwtVzsBJSl_TM2oLJhR22Bwpb0I",
  authDomain: "love-2-697ee.firebaseapp.com",
  projectId: "love-2-697ee",
  messagingSenderId: "557984264400",
  appId: "1:557984264400:web:aa4b1f5cfde5fa757c2ed5"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(); 

let messaging = null;

if (firebase.messaging && "serviceWorker" in navigator) {
  messaging = firebase.messaging();
} else {
  console.warn("Firebase Messaging not supported in this browser");
}



async function enableNotifications(uid) {
  if (!messaging) return;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const token = await messaging.getToken({
      vapidKey: "BFYZYGBt-GAc4iQdm423YyJqFK5Kqve4LLz7r_6sfEc_mD9Ws_1oSz1WiYKESMQ-2TFUbBh2X_BMMHtIeeqykXo"
    });

    if (!token) return;

    await db.collection("users").doc(uid).set({
      fcmToken: token
    }, { merge: true });

    console.log("🔔 Notifications enabled");
  } catch (err) {
    console.error("❌ Notification error:", err);
  }
}



function updateHeart() {}
function updateCompatibility() {}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/love/firebase-messaging-sw.js")
    .then(() => console.log("✅ Service worker registered"))
    .catch(err => console.error("❌ SW error", err));
}


// DOM
const loginScreen = document.getElementById("login-screen");
const mainContent = document.getElementById("main-content");
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginError = document.getElementById("login-error");

const yearsEl = document.getElementById("years");
const monthsEl = document.getElementById("months");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const loved = document.getElementById("loved");
const energy = document.getElementById("energy");
const busy = document.getElementById("busy");
const note = document.getElementById("note");
const saveStatus = document.getElementById("save-status");
const heart = document.getElementById("heart");
const compatibility = document.getElementById("compatibility");
const silent = document.getElementById("silent");

const resetTimer = document.getElementById("reset-timer");
const partnerTimer = document.getElementById("partner-timer");

// PARTNER DOM
const partnerCard = document.getElementById("partner-card");
const partnerWait = document.getElementById("partner-wait");
const partnerData = document.getElementById("partner-data");
const pLoved = document.getElementById("p-loved");
const pEnergy = document.getElementById("p-energy");
const pBusy = document.getElementById("p-busy");
const pNote = document.getElementById("p-note");

// DATE
const startDate = new Date(2025, 0, 22);

// AUTH
document.getElementById("loginBtn").onclick = () => {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .catch(e => loginError.innerText = e.message);
};

auth.onAuthStateChanged(user => {
  if (!user) return;
  loginScreen.style.display = "none";
  mainContent.classList.remove("hidden");
  startApp(user.uid);
  enableNotifications(user.uid);
});

// COUNTER
function updateCounter() {
  const now = new Date();

  let y = now.getFullYear() - startDate.getFullYear();
  let m = now.getMonth() - startDate.getMonth();
  let d = now.getDate() - startDate.getDate();

  if (d < 0) {
    m--;
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }

  const diff = now - startDate;

  yearsEl.innerText = y;
  monthsEl.innerText = m;
  daysEl.innerText = d;
  hoursEl.innerText = Math.floor(diff / 3600000) % 24;
  minutesEl.innerText = Math.floor(diff / 60000) % 60;
  secondsEl.innerText = Math.floor(diff / 1000) % 60;
}

// RESET TIMER
function timeUntilMidnight() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  const diff = midnight - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;

  resetTimer.innerText = `Resets in ${h}h ${m}m ${s}s`;
}

// TIME SINCE
function timeSince(timestamp) {
  if (!timestamp) return "";

  const date = timestamp.toDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `Posted at ${hours}:${minutes}`;
}


// APP
function startApp(uid) {
  updateCounter();
  timeUntilMidnight();
  setInterval(updateCounter, 1000);
  setInterval(timeUntilMidnight, 1000);
  setupSliders();
  loadToday(uid);
  loadDailyTexts();
requestNotificationPermission(uid);



 

}

// SLIDERS
function setupSliders() {
  document.querySelectorAll(".slider").forEach(s => {
    s.addEventListener("input", () => {
      document.getElementById(s.id + "-val").innerText = s.value;
      updateHeart();
    });
  });
}

// SAVE
document.getElementById("saveBtn").onclick = async () => {
  const today = new Date().toISOString().split("T")[0];
  const ref = db.collection("days").doc(today);
  const snap = await ref.get({ source: "server" });


if (snap.exists && snap.data()[auth.currentUser.uid]) {
  saveStatus.innerText = "Already saved today ❤";
  saveStatus.style.opacity = 1;
  return;
}




 await ref.set({
  [auth.currentUser.uid]: {
    loved: loved.value,
    energy: energy.value,
    busy: busy.value,
    note: note.value,
    time: firebase.firestore.FieldValue.serverTimestamp()
  }
}, { merge: true });

saveStatus.innerText = "Saved ❤";

};

// LOAD + PARTNER FIX
function loadToday(uid) {
  const today = new Date().toISOString().split("T")[0];

 db.collection("days").doc(today).onSnapshot(
  { includeMetadataChanges: true },
  doc => {
    if (doc.metadata.fromCache) return;


    // 🚨 NEW DAY → RESET EVERYTHING
    if (!doc.exists) {
      resetTodayUI();
      return;
    }

    const data = doc.data();
    const users = Object.keys(data);

    // LOAD YOUR DATA
    if (data[uid]) {
      loved.value = data[uid].loved;
      energy.value = data[uid].energy;
      busy.value = data[uid].busy;
      note.value = data[uid].note;

      document.getElementById("loved-val").innerText = loved.value;
      document.getElementById("energy-val").innerText = energy.value;
      document.getElementById("busy-val").innerText = busy.value;
    }

    // PARTNER
    const partnerId = users.find(id => id !== uid);

    if (partnerId && data[partnerId]) {
      partnerCard.classList.remove("blurred");
      partnerWait.classList.add("hidden");
      partnerData.classList.remove("hidden");

      pLoved.innerText = data[partnerId].loved;
      pEnergy.innerText = data[partnerId].energy;
      pBusy.innerText = data[partnerId].busy;
      pNote.innerText = data[partnerId].note
        ? `“${data[partnerId].note}”`
        : "";

      partnerTimer.innerText = timeSince(data[partnerId].time);
    }

    updateCompatibility(data);
    updateHeart();
  });
}


/* ------------------------
   DARK / LIGHT MODE TIME
------------------------ */
function applyThemeByTime() {
  const hour = new Date().getHours();

  // Dark mode: 22:00 → 07:00
  if (hour >= 22 || hour < 7) {
    document.body.classList.add("night");
  } else {
    document.body.classList.remove("night");
  }
}

applyThemeByTime();
setInterval(applyThemeByTime, 60 * 1000); // check every minute


/* ------------------------
   NEON SOFT PARTICLES
------------------------ */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const PARTICLE_COUNT = 60;
const particles = [];

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.8,
    speed: Math.random() * 0.12 + 0.04,
    drift: (Math.random() - 0.5) * 0.03,
    alpha: Math.random() * 0.5 + 0.3
  };
}


for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(createParticle());
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const night = document.body.classList.contains("night");

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

    ctx.fillStyle = night
      ? `rgba(207,176,91,${p.alpha})`
      : `rgba(255,255,255,${p.alpha})`;

    ctx.shadowBlur = night ? 18 : 10;
    ctx.shadowColor = night
      ? "rgba(207,176,91,0.8)"
      : "rgba(255,255,255,0.7)";

    ctx.fill();

    p.y += p.speed;
    p.x += p.drift;

    if (p.y > canvas.height) {
      p.y = -5;
      p.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(drawParticles);
}


drawParticles();




function resetTodayUI() {
  loved.value = 5;
  energy.value = 5;
  busy.value = 5;
  note.value = "";

  document.getElementById("loved-val").innerText = "5";
  document.getElementById("energy-val").innerText = "5";
  document.getElementById("busy-val").innerText = "5";

  saveStatus.innerText = "";
  compatibility.innerText = "";
  silent.innerText = "One heart is still waiting";

  // Partner reset
  partnerCard.classList.add("blurred");
  partnerWait.classList.remove("hidden");
  partnerData.classList.add("hidden");
  partnerTimer.innerText = "";

  updateHeart();
}


// =====================
// RESET TODAY UI
// =====================
 async function loadDailyTexts() {
  try {
    const response = await fetch("daily-texts.txt", { cache: "no-store" });
    const text = await response.text();

    const lines = text
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (!lines.length) return;

    const randomIndex = Math.floor(Math.random() * lines.length);
    const el = document.getElementById("daily-text");
    if (el) el.innerText = lines[randomIndex];

  } catch (err) {
    console.error("Failed to load daily texts:", err);
  }
}


async function requestNotificationPermission(uid) {
  if (!messaging) return;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const token = await messaging.getToken({
      vapidKey: "BFYZYGBt-GAc4iQdm423YyJqFK5Kqve4LLz7r_6sfEc_mD9Ws_1oSz1WiYKESMQ-2TFUbBh2X_BMMHtIeeqykXo"
    });

    if (!token) return;

    await db.collection("pushTokens").doc(uid).set({
      token,
      updated: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log("Push notifications enabled");

  } catch (err) {
    console.error("Notification error:", err);
  }
}


















