const {dialog} =    require("electron").remote;
const db =          require('electron-db')
var codFis =        require('calcolo-codice-fiscale');
const input =       require('./js/input.js');
const output =      require('./js/output.js');
const codFisJS =    require('./js/cod-fis.js');
const backup =      require('./js/backup.js');
                    require('bootstrap-table');
                    require('bootstrap');
const encryptor =   require('file-encryptor');
const ProgressBar = require('electron').remote.require('electron-progressbar');
var fs = require('fs');



var dbName = 'database';
const path = require('path');
var appName = 'progettouc-electron-db'
var userData = path.join(process.env.APPDATA, appName); //Nome del path del database  

dbPath = userData + '\\database.json'

