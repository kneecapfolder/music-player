const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const fs = require('fs');
const url = require('url');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow;
const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 700+500,
        height: 600,
        autoHideMenuBar: true,
        resizable: false,
        icon: 'images/icon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // And load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Quit app when closed
    mainWindow.on('close', app.quit);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on("save", async (list) => {
    let data = JSON.stringify(list)
    fs.writeFile('src/songs.json', data, 'utf-8', (err) => { });
});

// Create the song adding window
let addWindow = null;
ipcMain.on("open:add", () => {
    if (addWindow != null)
        return;

    addWindow = new BrowserWindow({
        width: 300,
        height: 360,
        autoHideMenuBar: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'add.html'),
        protocol: 'file:',
        slashes: true
    }))

    addWindow.on('close', () => {
        mainWindow.reload();
        addWindow = null;
    });

    // addWindow.webContents.openDevTools();
});

ipcMain.on('display', (elm) => {
    return elm;
})