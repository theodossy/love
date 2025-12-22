const correctPassword = "<3";
const startDate = new Date("2025-01-22T00:00:00");

function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === correctPassword) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-content").classList.remove("hidden");
    updateCounter();
    setInterval(updateCounter, 1000);
  } else {
    document.getElementById("error").innerText = "Wrong password";
  }
}

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


