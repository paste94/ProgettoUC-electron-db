const {dialog} =    require("electron").remote;
const db =          require('electron-db')
                    require('bootstrap-table');
var codFis =        require('calcolo-codice-fiscale');
const input =       require('./input.js');
const output =      require('./output.js')
                    require('bootstrap');

var dbName = 'database';
