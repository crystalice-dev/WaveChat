// SignOnViewScript.js

document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signin");
  const guestBtn = document.getElementById("guest");

  const profilesContainer = document.getElementById("profilesContainer");
  const profilesList = document.getElementById("profilesList");

  // Load profiles
  const profiles = window.appData.readProfiles();

  if (profiles && profiles.length > 0) {
    profilesContainer.classList.remove("hidden");

    profiles.forEach(profile => {
      const item = document.createElement("div");
      item.className = "profile-item";

      const isGuest = profile.mode === "guest";

      item.innerHTML = `
        <h3>${profile.screenName}</h3>
        <p>
          ${isGuest ? "Guest profile" : "Local profile"} ·
          ${profile.spokenLanguage.toUpperCase()} /
          ${profile.signLanguage.toUpperCase()}
        </p>
      `;

      item.onclick = () => {
        // ✅ Select profile
        window.app.setCurrentProfile(profile.id);
        sessionStorage.setItem("currentProfile", profile.id);

        // ✅ Go to Profile (NOT Lobby)
        window.location.replace("../onBoard/ProfileView.html");
      };

      profilesList.appendChild(item);
    });
  }

  // Sign in (future passcode / auth flow)
  signInBtn.onclick = () => {
    alert("Sign in coming soon");
  };

  // Guest flow
  guestBtn.onclick = () => {
    window.location.replace("./GuestSignOnView.html");
  };
});
