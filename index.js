const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const os = require('os')
const globalShortcut = electron.globalShortcut
const debug = true;

function createWindow () {
  // Create la finestra del browser
  let win = new BrowserWindow({ 
    width: 800, 
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      devTools: true
    } 
  })

  // and load the index.html of the app.
  win.loadFile('./res/index.html')
  if(debug){
    let platform = os.platform()
    if(platform === 'darwin'){
      globalShortcut.register('Command+Option+I',()=>{
        win.webContents.openDevTools()
      })
    }else if(platform === 'linux' || platform === 'win32'){
      globalShortcut.register('Control+Shift+I',()=>{
        win.webContents.openDevTools()
      })
    }
  }

  // delete main window on close
  win.on('closed', function () {
      win = null
  })

}

app.on('ready', createWindow)

// when all the windows are closed, quit the process
app.on('window-all-closed', () => { app.quit() })
