const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('faceApi', {
	onEyesChange: (handler) => ipcRenderer.on('face:eyes', (_e, payload) => handler(payload)),
	onSpeakChange: (handler) => ipcRenderer.on('face:speak', (_e, payload) => handler(payload)),
	onShowImage: (handler) => ipcRenderer.on('face:show-image', (_e, payload) => handler(payload)),
	onRemoveImage: (handler) => ipcRenderer.on('face:remove-image', () => handler())
});