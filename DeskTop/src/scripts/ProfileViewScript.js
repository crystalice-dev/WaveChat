// ProfileViewScript.js

(function initProfileView() {
  const screenNameInput = document.getElementById("screenName");
  const spokenSelect = document.getElementById("spokenLanguage");
  const signSelect = document.getElementById("signLanguage");
  const saveBtn = document.getElementById("saveProfile");
  const editToggle = document.getElementById("editToggle");
  const guestNote = document.getElementById("guestNote");
  const callsList = document.getElementById("recentCalls");

  const startCallBtn = document.getElementById("startCall");
  const joinCallBtn = document.getElementById("joinCall");
  const actionBtn = document.getElementById("profileActionBtn");

  // Recover profile ID (preload can reload)
  let profileId = window.app?.getCurrentProfile?.();
  if (!profileId) profileId = sessionStorage.getItem("currentProfile");

  if (!profileId) {
    window.location.replace("../preBoard/SignOnView.html");
    return;
  }

  const profiles = window.appData.readProfiles();
  const profile = profiles.find(p => p.id === profileId);

  if (!profile) {
    window.location.replace("../preBoard/SignOnView.html");
    return;
  }

  // Populate
  screenNameInput.value = profile.screenName;
  spokenSelect.value = profile.spokenLanguage;
  signSelect.value = profile.signLanguage;

  const isGuest = profile.mode === "guest";

  // Guest restrictions
  if (isGuest) {
    editToggle.disabled = true;
    guestNote.classList.remove("hidden");
  }

  // Toggle editing
  editToggle.onchange = () => {
    const enabled = editToggle.checked && !isGuest;
    screenNameInput.disabled = !enabled;
    spokenSelect.disabled = !enabled;
    signSelect.disabled = !enabled;
    saveBtn.disabled = !enabled;
  };

  // Save changes (uses updateProfile; implement in preload)
  saveBtn.onclick = () => {
    profile.screenName = screenNameInput.value.trim();
    profile.spokenLanguage = spokenSelect.value;
    profile.signLanguage = signSelect.value;

    window.appData.updateProfile(profile);
    alert("Profile updated");
  };

  // Delete (guest) OR Sign out (local/cloud later)
  if (isGuest) {
    actionBtn.textContent = "Delete Profile";
    actionBtn.onclick = () => {
      const ok = confirm("Delete this profile? This cannot be undone.");
      if (!ok) return;

      window.appData.deleteProfile(profile.id);

      // Clear selection
      window.app?.clearCurrentProfile?.();
      sessionStorage.removeItem("currentProfile");

      // Back to SignOn (NOT Lobby)
      window.location.replace("../preBoard/SignOnView.html");
    };
  } else {
    actionBtn.textContent = "Sign Out";
    actionBtn.onclick = () => {
      window.app?.clearCurrentProfile?.();
      sessionStorage.removeItem("currentProfile");
      window.location.replace("../preBoard/SignOnView.html");
    };
  }

  // Call stubs
  startCallBtn.onclick = () => {
    alert(`Starting call as ${profile.screenName}`);
  };

  joinCallBtn.onclick = () => {
    alert(`Joining call as ${profile.screenName}`);
  };

  // Recent calls placeholder
  const calls = profile.recentCalls || [
    "Call with Alex · 2 days ago",
    "Call with Sam · 1 week ago"
  ];

  callsList.innerHTML = "";
  calls.forEach(call => {
    const li = document.createElement("li");
    li.textContent = call;
    callsList.appendChild(li);
  });
})();
