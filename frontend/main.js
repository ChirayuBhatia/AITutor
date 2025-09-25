const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		fullscreen: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			nodeIntegration: false
		}
	});

	mainWindow.loadFile('renderer.html');
	// mainWindow.webContents.openDevTools(); // optional
}

function createServer() {
	const srv = express();
	srv.use(express.json());

	// health
	srv.get('/health', (_req, res) => res.json({ ok: true }));

	// Eyes
	srv.post('/openeye', (_req, res) => {
		mainWindow?.webContents.send('face:eyes', { state: 'open' });
		res.json({ status: 'ok', eyes: 'open' });
	});

	srv.post('/closeeye', (_req, res) => {
		mainWindow?.webContents.send('face:eyes', { state: 'closed' });
		res.json({ status: 'ok', eyes: 'closed' });
	});

	// Mouth speak start
	srv.post('/speak', (_req, res) => {
		mainWindow?.webContents.send('face:speak', { speaking: true });
		res.json({ status: 'ok', speaking: true });
	});

	// Mouth speak stop
	srv.post('/stopspeak', (_req, res) => {
		mainWindow?.webContents.send('face:speak', { speaking: false });
		res.json({ status: 'ok', speaking: false });
	});

	srv.post('/show-image', (req, res) => {
		const { imageUrl } = req.body;
		if (imageUrl) {
			mainWindow?.webContents.send('face:show-image', { url: imageUrl });
			res.json({ status: 'ok', action: 'show', url: imageUrl });
		} else {
			res.status(400).json({ status: 'error', message: 'imageUrl is required' });
		}
	});

	// Remove Image
	srv.post('/remove-image', (_req, res) => {
		mainWindow?.webContents.send('face:remove-image');
		res.json({ status: 'ok', action: 'remove' });
	});

	// Optional: CORS for testing with curl/Postman from other hosts
	srv.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		if (req.method === 'OPTIONS') return res.sendStatus(200);
		next();
	});

	const PORT = process.env.PORT || 3000;
	srv.listen(PORT, () => {
		console.log(`Face control API listening on http://localhost:${PORT}`);
	});
}

app.whenReady().then(() => {
	createWindow();
	createServer();

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});
