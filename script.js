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

// DATE (correct)
const startDate = new Date(2025, 0, 22);

// AUTH
document.getElementById("loginBtn").onclick = () => {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .catch(e => loginError.innerText = e.message);
};

document.getElementById("registerBtn").onclick = () => {
  auth.createUserWithEmailAndPassword(email.value, password.value)
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

// APP
function startApp(uid) {
  updateCounter();
  setInterval(updateCounter, 1000);
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

  db.collection("days").doc(today)
    .onSnapshot(doc => {
      if (!doc.exists) return;
      const data = doc.data();

      if (data[uid]) {
        loved.value = data[uid].loved;
        energy.value = data[uid].energy;
        busy.value = data[uid].busy;
        note.value = data[uid].note;

        // 🔥 FIX: update visible numbers on load
        document.getElementById("loved-val").innerText = loved.value;
        document.getElementById("energy-val").innerText = energy.value;
        document.getElementById("busy-val").innerText = busy.value;
      }

      updateCompatibility(data);
      updateHeart();
    });
}


// COMPATIBILITY
function updateCompatibility(data) {
  const vals = Object.values(data);
  if (vals.length < 2) {
    silent.innerText = "One heart is still waiting ❤";
    return;
  }

  silent.innerText = "";
  const avg = (Number(vals[0].loved) + Number(vals[1].loved)) / 2;
  compatibility.innerText =
    avg > 7 ? "In sync ❤" :
    avg > 4 ? "One of you needs care" :
    "Hard day – be gentle";
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

