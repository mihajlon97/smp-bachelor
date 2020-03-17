import { app, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
	  webPreferences: {
		  nodeIntegration: true
	  },
    height: 900,
    useContentSize: true,
    width: 1600
  });

	mainWindow.setMenuBarVisibility(false)
	mainWindow.maximize()
	mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  });

	mainWindow.webContents.on("devtools-opened", () => {
		if (process.env.NODE_ENV !== 'development') {
			mainWindow.webContents.closeDevTools();
		}
	});

	let oldSize;
	setInterval(() => {
		oldSize = mainWindow.getSize();
	}, 10);
	mainWindow.on('resize', () => {
		let size = mainWindow.getSize();
		let widthChanged = oldSize[0] !== size[0];
		let ratioY2X = 900 / 1600;
		if (widthChanged)
			mainWindow.setSize(size[0], parseInt((size[0] * ratioY2X).toString()));
		else
			mainWindow.setSize(parseInt((size[1] / ratioY2X).toString()), size[1]);
	});


}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
