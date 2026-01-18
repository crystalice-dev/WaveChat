// preload.js
const { contextBridge } = require("electron");
const fs = require("fs");
const path = require("path");

/* -----------------------------
   PERSISTENT RUNTIME STATE
------------------------------ */
const appState = {
  currentProfile: null
};

/* -----------------------------
   DATA FILE
------------------------------ */
const dataPath = path.join(
  __dirname,
  "src",
  "bin",
  "App_data",
  "LocalData.json"
);

/* -----------------------------
   FILE HELPERS
------------------------------ */
function readData() {
  if (!fs.existsSync(dataPath)) {
    return { profiles: [] };
  }

  const raw = fs.readFileSync(dataPath, "utf-8").trim();

  if (!raw) {
    return { profiles: [] };
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Invalid JSON in LocalData.json, resetting", err);
    return { profiles: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(
    dataPath,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

/* -----------------------------
   EXPOSE DATA API
------------------------------ */
contextBridge.exposeInMainWorld("appData", {

  readProfiles() {
    return readData().profiles || [];
  },

  addProfile(profile) {
    const data = readData();
    data.profiles = data.profiles || [];
    data.profiles.push(profile);
    writeData(data);
  },

  updateProfile(updatedProfile) {
    const data = readData();
    data.profiles = data.profiles || [];

    const index = data.profiles.findIndex(
      p => p.id === updatedProfile.id
    );

    if (index === -1) {
      // Safe fallback: add if missing
      data.profiles.push(updatedProfile);
    } else {
      data.profiles[index] = {
        ...data.profiles[index],
        ...updatedProfile
      };
    }

    writeData(data);
  },

  deleteProfile(profileId) {
    const data = readData();
    data.profiles = (data.profiles || [])
      .filter(p => p.id !== profileId);

    writeData(data);
  }
});

/* -----------------------------
   EXPOSE APP STATE API
------------------------------ */
contextBridge.exposeInMainWorld("app", {

  setCurrentProfile(profileId) {
    console.log("preload:setCurrentProfile", profileId);
    appState.currentProfile = profileId;
  },

  getCurrentProfile() {
    console.log("preload:getCurrentProfile →", appState.currentProfile);
    return appState.currentProfile;
  },

  clearCurrentProfile() {
    appState.currentProfile = null;
  }
});
