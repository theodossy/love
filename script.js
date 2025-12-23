// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDH8rZPpwtVzsBJSl_TM2oLJhR22Bwpb0I",
  authDomain: "love-2-697ee.firebaseapp.com",
  projectId: "love-2-697ee"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

db.enablePersistence().catch(() => {});

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

// DATE
const startDate = new Date(2025, 0, 22);

// AUTH
document.getElementById("loginBtn").onclick = () => {
  auth
    .signInWithEmailAndPassword(email.value, password.value)
    .catch(e => loginError.innerText = e.message);
};

auth.onAuthStateChanged(user => {
  if (!user) return;
  loginScreen.style.display = "none";
  mainContent.classList.remove("hidden");
  startApp(user.uid);
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

// PARTNER TIME
function timeSince(timestamp) {
  if (!timestamp) return "";
  const diff = new Date() - timestamp.toDate();

  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000) % 60;

  return h > 0
    ? `Uploaded ${h}h ${m}m ago`
    : `Uploaded ${m}m ago`;
}

// APP
function startApp(uid) {
  updateCounter();
  timeUntilMidnight();
  setInterval(updateCounter, 1000);
  setInterval(timeUntilMidnight, 1000);
  setupSliders();
  loadToday(uid);
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
  const snap = await ref.get();

  if (snap.exists && snap.data()[auth.currentUser.uid]) {
    saveStatus.innerText = "Already saved today ❤";
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

// LOAD
function loadToday(uid) {
  const today = new Date().toISOString().split("T")[0];

  db.collection("days").doc(today).onSnapshot(doc => {
    if (!doc.exists) return;

    const data = doc.data();
    const users = Object.keys(data);

    if (data[uid]) {
      loved.value = data[uid].loved;
      energy.value = data[uid].energy;
      busy.value = data[uid].busy;
      note.value = data[uid].note;

      document.getElementById("loved-val").innerText = loved.value;
      document.getElementById("energy-val").innerText = energy.value;
      document.getElementById("busy-val").innerText = busy.value;
    }

    const partnerId = users.find(id => id !== uid);
    if (partnerId && data[partnerId]) {
      partnerTimer.innerText = timeSince(data[partnerId].time);
    }

    updateCompatibility(data);
    updateHeart();
  });
}

// COMPATIBILITY
function updateCompatibility(data) {
  const vals = Object.values(data);
  if (vals.length < 2) {
    compatibility.innerText = "";
    silent.innerText = "One heart is still waiting";
    return;
  }

  silent.innerText = "";

  const score =
    Math.abs(vals[0].loved - vals[1].loved) * 1.6 +
    Math.abs(vals[0].energy - vals[1].energy) * 1.1 +
    Math.abs(vals[0].busy - vals[1].busy) * 0.8;

  compatibility.innerText =
    score <= 3 ? "Perfectly in sync" :
    score <= 7 ? "Doing okay — stay close" :
    "One of you needs care";
}

// HEART
function updateHeart() {
  const avg = Number(loved.value);
  heart.style.animationDuration = `${2 - avg * 0.12}s`;
  heart.style.boxShadow = avg > 7 ? "0 0 30px #ff5c8a" : "none";
}

// NIGHT MODE
if (new Date().getHours() >= 22) {
  document.body.classList.add("night");
}
