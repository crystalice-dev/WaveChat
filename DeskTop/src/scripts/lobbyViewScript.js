// src/scripts/lobbyViewScript.js

const profilesList = document.getElementById("profilesList");

// Load profiles from LocalData.json
const profiles = window.appData.readProfiles();

if (!profiles || profiles.length === 0) {
  profilesList.innerHTML =
    `<p style="opacity:0.6">No profiles found</p>`;
} else {
  profiles.forEach(profile => {
    const card = document.createElement("div");
    card.className = "profile-card";

    const isGuest = profile.mode === "guest";

    card.innerHTML = `
      <div class="avatar"></div>
      <div class="profile-info">
        <h3>
          ${profile.screenName}
          ${isGuest ? `<span class="guest-tag">(${profile.id})</span>` : ""}
        </h3>
        <p>
          Spoken: ${profile.spokenLanguage.toUpperCase()} ·
          Sign: ${profile.signLanguage.toUpperCase()}
        </p>
      </div>
    `;

    card.onclick = () => {
      // Primary (runtime)
      window.app.setCurrentProfile(profile.id);

      // Fallback (session-scoped, survives navigation)
      sessionStorage.setItem("currentProfile", profile.id);

      window.location.replace("./ProfileView.html");
    };


    profilesList.appendChild(card);
  });
}
