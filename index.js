const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const os = require('os')
const globalShortcut = electron.globalShortcut
const debug = true;


function createWindow () {
  // Create la finestra del browser
  let win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadFile('index.html')

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
}

app.on('ready', createWindow)