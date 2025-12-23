* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: linear-gradient(180deg, #ffd6e0, #ffc0cf);
  color: #b00040;
  text-align: center;
  position: relative;
}

body.night {
  background: linear-gradient(180deg, #1a0010, #090008);
  color: #ffd0e0;
}

.hidden { display: none; }

/* PARTICLES */
#particles {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* CONTENT */
#login-screen, #main-content {
  position: relative;
  z-index: 2;
}

/* LOGIN */
#login-screen {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

/* BASIC UI */
input, textarea {
  padding: 12px;
  border-radius: 25px;
  border: none;
}

button {
  padding: 14px 35px;
  border-radius: 30px;
  border: none;
  background: #ff5c8a;
  color: white;
  cursor: pointer;
}

.since {
  background: #ff9bb5;
  padding: 12px 25px;
  border-radius: 30px;
  display: inline-block;
}

.circle {
  width: 230px;
  height: 230px;
  background: #ff9bb5;
  border-radius: 50%;
  margin: 30px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-row {
  display: flex;
  gap: 20px;
  justify-content: center;
  background: #ff9bb5;
  padding: 18px;
  border-radius: 30px;
}

.feelings-board {
  background: #ff9bb5;
  padding: 25px;
  border-radius: 30px;
  margin-top: 30px;
}

.partner-card.blurred {
  filter: blur(6px);
  opacity: 0.6;
}

.heart {
  width: 55px;
  height: 55px;
  background: #ff5c8a;
  transform: rotate(-45deg);
  margin: 30px auto;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  50% { transform: scale(1.15) rotate(-45deg); }
}
