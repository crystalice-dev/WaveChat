// GuestSignOnViewScript.js

const steps = [
  "name-card",
  "dob-card",
  "spoken-card",
  "sign-card",
  "saving-card"
];

let currentStepIndex = 0;
const cards = steps.map(id => document.getElementById(id));

const guestData = {};

function showStep(index) {
  cards.forEach((card, i) => {
    card.classList.toggle("hidden", i !== index);
  });
  currentStepIndex = index;
}

// STEP 1: SCREEN NAME
document.getElementById("name-continue").onclick = () => {
  const name = document.getElementById("screenName").value.trim();
  if (!name) return alert("Enter a screen name");

  guestData.screenName = name;
  showStep(1);
};

// STEP 2: DOB (stored but optional later)
document.getElementById("dob-continue").onclick = () => {
  const dob = document.getElementById("dob").value;
  if (!dob) return alert("Select your date of birth");

  guestData.dob = dob;
  showStep(2);
};

// STEP 3: SPOKEN LANGUAGE
document.getElementById("spoken-continue").onclick = () => {
  const lang = document.getElementById("spokenLanguage").value;
  if (!lang) return alert("Select a language");

  guestData.spokenLanguage = lang;
  showStep(3);
};

// STEP 4: SIGN LANGUAGE → SAVE PROFILE
document.getElementById("sign-continue").onclick = () => {
  const sign = document.getElementById("signLanguage").value;
  if (!sign) return alert("Select a sign language");

  const profile = {
    id: "guest_" + crypto.randomUUID().slice(0, 8),
    screenName: guestData.screenName,
    spokenLanguage: guestData.spokenLanguage,
    signLanguage: sign,
    mode: "guest",
    createdAt: Date.now()
  };

  showStep(4);

  setTimeout(() => {
    // ✅ Persist profile to disk
    window.appData.addProfile(profile);

    // ✅ Runtime state (best-effort)
    window.app.setCurrentProfile(profile.id);

    // ✅ Fallback state (navigation-safe)
    sessionStorage.setItem("currentProfile", profile.id);

    // Go to lobby
    window.location.replace("../onBoard/LobbyView.html");
  }, 1200);
};

