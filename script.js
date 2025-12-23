// 🔥 FIREBASE CONFIG (PASTE YOURS)
const firebaseConfig = {
  apiKey: "AIzaSyDH8rZPpwtVzsBJSl_TM2oLJhR22Bwpb0I",
  authDomain: "love-2-697ee.firebaseapp.com",
  projectId: "love-2-697ee",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Offline mode
db.enablePersistence().catch(() => {});

// DATE
const startDate = new Date(2025, 0, 22);

// AUTH
function register() {
  auth.createUserWithEmailAndPassword(
    email.value,
    password.value
  ).catch(e => loginError.innerText = e.message);
}

function login() {
  auth.signInWithEmailAndPassword(
    email.value,
    password.value
  ).catch(e => loginError.innerText = e.message);
}

auth.onAuthStateChanged(user => {
  if (!user) return;
  loginScreen.style.display = "none";
  mainContent.classList.remove("hidden");
  startApp(user.uid);
});

// COUNTER (CALENDAR CORRECT)
function updateCounter() {
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const diff = now - startDate;
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 60000) % 60;
  const hours = Math.floor(diff / 3600000) % 24;

  yearsEl.innerText = years;
  monthsEl.innerText = months;
  daysEl.innerText = days;
  hoursEl.innerText = hours;
  minutesEl.innerText = minutes;
  secondsEl.innerText = seconds;
}

// APP
function startApp(uid) {
  setInterval(updateCounter, 1000);
  loadToday(uid);
  setupSliders();
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

// SAVE (DAILY LOCK)
async function saveToday() {
  const today = new Date().toISOString().split("T")[0];
  const ref = db.collection("days").doc(today);

  const snap = await ref.get();
  const data = snap.exists ? snap.data() : {};

  if (data[auth.currentUser.uid]) {
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
}

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
  const avgLove = (Number(vals[0].loved) + Number(vals[1].loved)) / 2;

  compatibility.innerText =
    avgLove > 7 ? "In sync ❤" :
    avgLove > 4 ? "One of you needs care" :
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

