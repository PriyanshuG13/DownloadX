const {app, BrowserWindow} = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 1000,
        icon: __dirname + '../images/icons/icon.ico',
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    mainWindow.loadFile(path.join(__dirname, '../pages/Home.html'));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
