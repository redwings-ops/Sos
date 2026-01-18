let timer;
let cancelled = false;

const sosBtn = document.getElementById("sosBtn");
const cancelBtn = document.getElementById("cancelBtn");
const status = document.getElementById("status");

const numberInput = document.getElementById("emergencyNumber");
const addBtn = document.getElementById("addNumber");
const numberList = document.getElementById("numberList");

let emergencyNumbers =
  JSON.parse(localStorage.getItem("emergencyNumbers")) || [];

function renderNumbers() {
  numberList.innerHTML = "";
  emergencyNumbers.forEach((num, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${num} <button onclick="removeNumber(${index})">✕</button>`;
    numberList.appendChild(li);
  });
  localStorage.setItem("emergencyNumbers", JSON.stringify(emergencyNumbers));
}

function removeNumber(index) {
  emergencyNumbers.splice(index, 1);
  renderNumbers();
}

addBtn.onclick = () => {
  const num = numberInput.value.trim();
  if (!num) {
    alert("Enter a valid number");
    return;
  }
  emergencyNumbers.push(num);
  numberInput.value = "";
  renderNumbers();
};

renderNumbers();

sosBtn.onclick = () => {
  cancelled = false;
  sosBtn.disabled = true;
  cancelBtn.classList.remove("hidden");

  let seconds = 5;
  status.innerText = `Sending SOS in ${seconds}s`;

  timer = setInterval(() => {
    seconds--;
    status.innerText = `Sending SOS in ${seconds}s`;

    if (seconds === 0) {
      clearInterval(timer);
      if (!cancelled) triggerSOS();
    }
  }, 1000);
};

cancelBtn.onclick = () => {
  cancelled = true;
  clearInterval(timer);
  resetUI("❌ Cancelled");
};

function triggerSOS() {
  status.innerText = "📍 Getting location...";

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const message =
        `🚨 EMERGENCY SOS!\nI need help immediately.\nLocation:\nhttps://maps.google.com/?q=${lat},${lng}`;

      openSMS(message);
    },
    () => {
      openSMS("🚨 EMERGENCY SOS! I need help. Location unavailable.");
    }
  );
}

function openSMS(message) {
  if (emergencyNumbers.length === 0) {
    alert("Add at least one emergency number");
    resetUI("No emergency numbers saved");
    return;
  }

  const recipients = emergencyNumbers.join(",");
  const smsURL = `sms:${recipients}?body=${encodeURIComponent(message)}`;
  window.location.href = smsURL;
  status.innerText = "📨 SMS app opened. Tap SEND.";
}

function resetUI(msg) {
  status.innerText = msg;
  sosBtn.disabled = false;
  cancelBtn.classList.add("hidden");
}
