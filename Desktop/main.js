const { app, BrowserWindow, screen, Menu, ipcMain, session } = require("electron");
const path = require("path");

let win; // Declare win globally so it's accessible in IPC

const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    
    win = new BrowserWindow({
        width: Math.min(1280, Math.floor(width * 0.8)),
        height: Math.min(900, Math.floor(height * 0.8)),
        minHeight: Math.min(900, Math.floor(height * 0.8)),
        minWidth: Math.min(1280, Math.floor(width * 0.8)),
        frame: true, // intentional
        
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    
    // Center the window
    win.center();
    win.loadFile("index.html");
    
    // Define custom menu
    const menuTemplate = [
        {
            label: "File",
            submenu: [{ role: "quit" }]
        },
        {
            label: "Help",
            submenu: [
                {
                    label: "About",
                    click: () => {
                        win.webContents.send("show-alert");
                    }
                }
            ]
        }
    ];
    
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
};

// 🔐 Permission handler for camera/microphone access
app.whenReady().then(() => {
    // Handle permission requests (camera, microphone, etc.)
    session.defaultSession.setPermissionRequestHandler(
        (webContents, permission, callback) => {
            const allowedPermissions = ["media", "mediaKeySystem", "geolocation"];
            
            if (allowedPermissions.includes(permission)) {
                callback(true); // ✅ Allow camera/mic/location
            } else {
                callback(false); // ❌ Deny other permissions
            }
        }
    );
    
    // Additional permission check handler for specific device access
    session.defaultSession.setPermissionCheckHandler(
        (webContents, permission, requestingOrigin, details) => {
            if (permission === "media") {
                return true; // ✅ Allow camera/microphone
            }
            return false;
        }
    );
    
    // Handle device permission requests (for getUserMedia)
    session.defaultSession.on('select-usb-device', (event, details, callback) => {
        event.preventDefault();
        if (details.deviceList && details.deviceList.length > 0) {
            callback(details.deviceList[0].deviceId);
        }
    });
    
    createWindow();
});

// IPC Listeners
ipcMain.on("restart-app", () => {
    app.relaunch();
    app.exit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

require("electron-reload")(__dirname);