// https://datatables.net/download/
const fs = require("fs");
const db = require('electron-db')
const { app, BrowserWindow } = require("electron");
const {dialog} = require("electron").remote;
require('bootstrap');

require('bootstrap-table');

var dataArray;

var dbName = 'database';
var dbPath = '.\\database\\';

db.getAll('customers', (succ, data) => {
    dataArray = data;
  })

tableOpts = {
  pagination: true,
  search: true,
  url: "../../database/database.json",
  dataField: 'database',
  maintainSelected: true,
  pageList: "[10, 25, 50, 100, ALL]",
  pagination: true,
  sortable: true,
  checkboxHeader: false,
  uniqueId: 'id',
  selectItemName: 'selectItemName',
  buttonsToolbar: '.buttons-toolbar',
  showColumns: true,
  columns: [{
      field: 'Selez',
      checkbox: true
  },{
      field: 'Nome',
      title: 'Nome',
      sortable:true
  },{
      field: 'Cognome',
      title: 'Cognome',
      sortable:true
  },{
      field: 'Sesso',
      title: 'Sesso',
      sortable:true
  },{
      field: 'DataNascita',
      title: 'Data di Nascita',
      sortable:true
  },{
      field: 'CodFis',
      title: 'Codice Fiscale',
      sortable:true
  },{
      field: 'Numero',
      title: 'Tessera',
      sortable:true
  },{
      field: 'Codice',
      title: 'Codice Società',
      sortable:true
  },{
      field: 'IDSodalizio',
      title: 'Nome Società',
      sortable:true
  },{
      field: 'Chip',
      title: 'Chip',
      formatter: function(value, row, index){
        return formatChip(value, row, index);
      }
      
  },{
      field: 'id',
      visible: false
  },{
      field: 'Opt',
      title: 'Opt',
      formatter: function(value, row, index){
        return formatDelete(value, row, index);
      },
      events: {
        'click .remove': function (e, value, row, index) {
            deleteRow(e, value, row, index)
        }
      }
  }],

  onDblClickCell: function(field, value, row, element){
      editCell(field, value, row, element);
  },

  onCheck: function(row, element){
      check(row, true)
  },

  onUncheck: function(row, element){
      check(row, false)
  }
}
$('#table').bootstrapTable(tableOpts)

db.getRows(dbName, dbPath, {
    Selez: true
  }, (succ, result) => {
    $('#selected-rows').html(result.length)
})

db.getRows(dbName, dbPath, {
    Chip: true
  }, (succ, result) => {
    $('#chip-rows').html(result.length)
})


db.createTable(dbName, dbPath, (succ, msg) => {})