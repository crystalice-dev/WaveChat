const { app, BrowserWindow, screen, Menu, ipcMain } = require("electron");
const path = require("path");

let win; // Declare win globally so it's accessible in IPC

const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    win = new BrowserWindow({
        width: Math.min(1280, Math.floor(width * 0.8)),
        height: Math.min(900, Math.floor(height * 0.8)),
        frame: false, // Remove the default window frame (and buttons)
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"), // Preload script for IPC
        },
    });

    // Center the window
    win.center();

    win.loadFile("index.html");

    // Define custom menu
    const menuTemplate = [
        {
            label: "File",
            submenu: [
                { role: "quit" } // Adds a Quit option
            ]
        },
        {
            label: "Help",
            submenu: [
                {
                    label: "About",
                    click: () => {
                        win.webContents.send("show-alert"); // Send event to renderer
                    }
                }
            ]
        }
    ];

    // Set the custom menu
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
};

// IPC Listeners for custom window actions
ipcMain.on("window-minimize", () => {
    win.minimize();
});

ipcMain.on("window-maximize", () => {
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
});

ipcMain.on("window-close", () => {
    win.close();
});

app.whenReady().then(createWindow);

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
