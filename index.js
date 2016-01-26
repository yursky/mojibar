var menubar = require('menubar')
var ipc = require('electron').ipcMain
var globalShortcut = require('global-shortcut')
var mb = menubar({ dir: __dirname + '/app', width: 400, height: 190, icon: __dirname + '/app/Icon-Template.png', preloadWindow: true, 'window-position': 'topRight' })
var Menu = require('menu')

mb.app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})

mb.app.on('activate', function () {
  mb.showWindow()
})

// when receive the abort message, close the app
ipc.on('abort', function () {
  mb.hideWindow()
})

// when receive the abort message, close the app
ipc.on('update-preference', function (evt, pref) {
  registerShortcut(pref['open-window-shortcut'])
})

var template = [
  {
    label: 'Mojibar',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      },
      {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      },
      {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function(item, focusedWindow) { if (focusedWindow) focusedWindow.reload() }
      },
      {
        label: 'Preferance',
        accelerator: 'Command+,',
        click: function () { mb.window.webContents.send('open-preference') }
      },
      {
        label: 'Quit App',
        accelerator: 'Command+Q',
        selector: 'terminate:'
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: function () { mb.window.toggleDevTools() }
      }
    ]
  }
]

mb.on('ready', function ready () {
  // Build default menu for text editing and devtools. (gone since electron 0.25.2)
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  registerShortcut('ctrl+shift+space')
})

// Register a shortcut listener.
var registerShortcut = function (keybinding) {
  globalShortcut.unregisterAll()

  var ret = globalShortcut.register(keybinding, function () {
    mb.window.isVisible() ? mb.hideWindow() : mb.showWindow()
  })

  if (!ret) {
    console.log('registration failed')
  }
}
