var jsonObjFromTable;
const {dialog} = require("electron").remote;
const db = require('./electron-db')
require('bootstrap-table');
const fs = require("fs");
//const { app, BrowserWindow } = require("electron");
require('bootstrap');


var dataArray;

var dbName = 'database';
var dbPath = '.\\resources\\app\\';
//var dbPath = '.\\';

db.getAll('customers', (succ, data) => {
    dataArray = data;
  })


db.createTable(dbName, dbPath, (succ, msg) => {
  console.log('creazione DB: ' + msg)
})


tableOpts = {
  pagination: true,
  search: true,
  url: 'database.json',
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
  trimOnSearch: false,
  columns: [{
      field: 'Selez',
      checkbox: true
  },{
    field: 'Chip',
    title: 'Chip',
    formatter: function(value, row, index){
      return formatChip(value, row, index);
    }
  },{
    field: 'Elimina',
    title: 'Elimina',
    formatter: function(value, row, index){
      return formatDelete(value, row, index);
    }
    /*
    formatter: function(value, row, index){
      return formatDelete(value, row, index);
    },
    events: {
      'click .remove': function (e, value, row, index) {
          deleteRow(e, value, row, index)
      }
    }
    */
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
      field: 'id',
      visible: false
  }],

  onDblClickCell: function(field, value, row, element){
      editCell(field, value, row, element);
  },
  
  customSearch: function(data, text){
    
    ret = []
    colName = Object.keys(data[0])
    text = text.toLowerCase()
    textArray = text.split(" ")
    console.log(textArray)

    textArray.forEach(function(word){
      colName.forEach(function(col){
        ret = ret.concat(
          data.filter(function(row){
            return String(row[col]).toLowerCase().indexOf(word) > -1
          })
        )
      })
    })
    
    uniq = [...new Set(ret)];
    console.log(uniq)

    return uniq
    
    /*
    return data.filter(function (row){
      return row.field.indexOf(text) > -1 
    })
    */
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



// Carica file XLS
$('#load-file').click(function(){
    /* Dialog per selezionare il file da caricare  */
    jsonObjFromTable = {};
    var fileName = dialog.showOpenDialog({
      filters: [
        {
          name: 'Excel (.xlsx; .xls)',
          extensions: ['xlsx', 'xls']
        }
      ]
    })
    
    if(fileName == null){
      return
    }

    //var fileName = e.target.files[0].path;
    if(typeof require !== 'undefined') XLSX = require('xlsx');
    var workbook = XLSX.readFile(fileName[0], {cellDates:true, cellNF:false, cellText:false});
    var first_sheet_name = workbook.SheetNames[0];
    /* Ottieni worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];

    /* Convert all sheet to json object */
    jsonObjFromTable = XLSX.utils.sheet_to_json(worksheet, {dateNF:'YYYY-MM-DD'})

    var keys = Object.keys(jsonObjFromTable[0])
    console.log(keys.indexOf("cf sodalizio") > -1)
    if(keys.indexOf("cf sodalizio") > -1){
      jsonObjFromTable.forEach((elem)=>{
        elem.Codice = elem['cf sodalizio']
      })
    }

    console.log(jsonObjFromTable)


    if(jsonObjFromTable[0].Codice == 0){
      $('#modal-add-excel').modal('toggle') // Riferimento al listener di btn-add-excel
    }else{
      console.log('okokokokokokokokookokok')
      loadElements(jsonObjFromTable)
    }
})// Fine carica file XLS

// Carica file excel non società vercelli
$('#btn-add-excel').click(()=>{
  var codiceSoc = $('#codice-soc-excel').val()
  var nomeSoc = $('#nome-soc-excel').val()
  jsonObjFromTable.forEach((e)=>{
    e.Codice = codiceSoc;
    e.IDSodalizio = nomeSoc
  })
  loadElements(jsonObjFromTable)
})

// Crea la tabella  partire dal file excel
function loadElements(jsonObjFromTable){
  jsonObjFromTable.forEach(element => { 
    if(element.Numero != 0){
      var o = {
        Selez: false,
        Elimina: false,
        Cognome: element.Cognome, //
        Nome: element.Nome, //
        Sesso: element.Sesso, //
        DataNascita: element.DataNascita.getDate() + '/' + (element.DataNascita.getMonth() + 1) + '/' + element.DataNascita.getUTCFullYear(),
        CodFis: element.CodFis,
        Numero: element.Numero,
        Codice: element.Codice,
        IDSodalizio: element.IDSodalizio,
        Chip: false
      }
      db.insertTableContent(dbName, dbPath, o, (succ, msg) => {})


      location.reload(true);
    }
  });
}

// MYSDAM
$('#mysdam').click(function(){
  // Crea un file json con i dati selezionati in tabella 
  var considerChip = true
  var read = $('#table').bootstrapTable('getSelections');
  if(read.length == 0) {// Controllo il numero di elementi selezionati
    alert('Attenzione, selezionare almeno una riga prima di proseguire!');
    return;
  }
  
  if(confirm("Considerare il chip?")){
    considerChip = false
  }
  
  
  jsonObj = []

  read.forEach((e)=>{
    if(e.Chip || considerChip){
      var o = {
        Pettorale: '',
        Cognome: e.Cognome,
        Nome: e.Nome,
        Sesso: e.Sesso,
        Cat: '',
        Tessera: e.Numero,
        Team: e.IDSodalizio
      }
      o['Data di Nascita'] = e.DataNascita;
      o['Cod.Soc.'] = e.Codice;
  
      jsonObj.push(o)
    }
  })

  scaricaExcel(jsonObj);
})

// CLASSIFICA
$('#classifica').click(function(){
  var read = $('#table').bootstrapTable('getSelections');
  if(read.length == 0) {// Controllo il numero di elementi selezionati
    alert('Attenzione, selezionare almeno una riga prima di proseguire!');
    return;
  }

  var arrayCodici = []

  read.forEach((e)=>{
    arrayCodici.push(e.Codice)
  })

  var counts = {};
  arrayCodici.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
  console.log(counts)

  var jsonObj = [];

  read.forEach((element) => {
    insert = true
    jsonObj.forEach((e)=>{
      if(e['Codice Società'] == element.Codice){
        insert = false;
      }
    })

    if(insert){
      var o = {}
      o['Società'] = element.IDSodalizio
      o['Codice Società'] = element.Codice
      o['Q.ta'] = counts[element.Codice]
      jsonObj.push(o)
    }
  })
  console.log(jsonObj)
  scaricaExcel(jsonObj)
})

// EVENTI
$('#eventi').click(function(){
  var read = $('#table').bootstrapTable('getSelections');
  var jsonObj = [];
  if(read.length == 0) {// Controllo il numero di elementi selezionati
    alert('Attenzione, selezionare almeno una riga prima di proseguire!');
    return;
  }

  read.forEach((e)=>{
    var o = {}
    o.Cognome = e.Cognome
    o.Nome = e.Nome
    o.Sesso = e.Sesso
    o['Data di Nascita'] = e.DataNascita
    o['Codice Fiscale'] = e.CodFis
    o['Cod.Soc.'] = e.Codice
    o['Nome Società'] = e.IDSodalizio
    jsonObj.push(o); // Stringa json che rappresenta la riga
  })
  scaricaExcel(jsonObj);
})

//SQUADRE
$('#eventi-squadra').click(function(){
  defineTeamModal();
  // Vedi definizione per bottone team-select
})

// SQUADRE
$('#btn-team').click(()=>{
  var selezionati
  db.getRows(dbName, dbPath, {
    Selez: true,
    Codice: $('#team-select').val()
  }, (succ, result) => {
    selezionati = result
  })

  var jsonObj = [];
  if(selezionati.length == 0) {// Controllo il numero di elementi selezionati
    alert('Attenzione, selezionare almeno una riga prima di proseguire!');
    return;
  }

  selezionati.forEach((e)=>{
    var o = {}
    o.Cognome = e.Cognome
    o.Nome = e.Nome
    o['Data di Nascita'] = e.DataNascita
    o['Codice Fiscale'] = e.CodFis
    jsonObj.push(o); // Stringa json che rappresenta la riga
  })
  $('#modal-select-team').modal('toggle')
  
  scaricaExcel(jsonObj);
})

// Scarica file excel
function scaricaExcel(jsonObj){  
  // Mostra la finestra per selezionare dove salvare il file 
  try{
    var filename = dialog.showSaveDialog({
      filters: [
        {
          name: 'Excel (.xlsx)',
          extensions: ['xlsx']
        }
      ]
    })
  
    // Salva il file 
    if(typeof require !== 'undefined') XLSX = require('xlsx'); // Richiede dipendenze se non ci sono
    var ws = XLSX.utils.json_to_sheet(jsonObj); // Converte l'oggetto json in un file xls
    var wb = XLSX.utils.book_new(); // Crea un nuovo file xls
    XLSX.utils.book_append_sheet(wb, ws, "People"); // Scrive la tabella nel file 
    XLSX.writeFile(wb, filename); // Salva il file nel percorso selezionato  
  }catch(err){}
  
}

// Definisce il modal usato per selezionare il team (per squadre)
function defineTeamModal(){
  $('#modal-select-team').modal('toggle')

  var read = $('#table').bootstrapTable('getSelections');
  elencoSquadre = []
  read.forEach((e)=>{
    var insert = true

    elencoSquadre.forEach((sq)=>{
      if(e.Codice == sq.Codice){
        insert = false
      }
    })

    if(insert){
      elencoSquadre.push({
        Codice: e.Codice,
        IDSodalizio: e.IDSodalizio
      })
    }

    var body  = '<select class="form-control" id="team-select">';
    elencoSquadre.forEach((element)=>{
      body += '<option value=' + element.Codice + '>' + element.IDSodalizio + '</option>'
    })
    body += '</select>'

    $('#modal-body-team').html(body)

  })
}

//--TABELLA--------------------------------------------------------------------------//

// Aggiungi una riga manualmente 
$('#add-row').click(function(){
  // TODO: File da scaricare 
  // TODO: Aggiungi barra di caricamento per operazioni pesanti (load da excel, checkall e unchackall)    

  var obj = {
      Selez:              false,
      Cognome:            $('#cognome').val(),
      Nome:               $('#nome').val(),
      Sesso:              $('#sesso').val(),
      DataNascita:        $('#data').val(),
      CodFis:             $('#cf').val(),
      Numero:             $('#tessera').val(),
      Codice:             $('#codice-soc').val(),
      IDSodalizio:        $('#nome-soc').val(),
      Chip:               'No' 
  }

  db.insertTableContent(dbName, dbPath, obj, (succ, msg) => {
      if(succ){
          $('#table').bootstrapTable('append',obj);
      }else{
          alert(msg);
      }
  })

  $('#add-modal').modal('toggle')
})

// Cosa succede quando selezioni la riga
function check(row, val){
  var n = parseInt($('#selected-rows').html())
  if(val){
      n++
  }else{
      n--
  }
  $('#selected-rows').html(n)
  db.updateRow( 
      dbName, 
      dbPath, 
      where = {
          'id': row.id
      },
      set = {
          'Selez': val
      },
      (succ, msg)=>{
          if(!succ){
              alert(msg)
          }
      }
  )
}

// Modifica cella
function editCell(field, value, row, element){
  if(field == 'Selez' || field == 'Elimina' || field == 'Chip'){
      return
  }
  var body = ''
  if(field == 'Sesso'){
      body += '<select class="form-control" row-id=' + row.id + ' field=' + field + ' id="edit">';
      if(value == 'M'){
          body += '<option selected>M</option>' + 
                  '<option>F</option>';
      }else{
          body += '<option>M</option>' + 
                  '<option selected>F</option>';
      }
      body += '</select>'
  }else{
      body += '<input id="edit" field=' + field + ' row-id=' + row.id + ' type="text" value=' + value + '  class="form-control"></input>'
  }
  var colName = field;
  
  if(field == 'IDSodalizio'){
      colName = 'Nome Società'
  }
  if(field == 'Codice'){
      colName = 'Codice Società'
  }
  if(field == 'Numero'){
      colName = 'Numero Tessera'
  }
  if(field == 'CodFis'){
      colName = 'Codice Fiscale'
  }
  if(field == 'DataNascita'){
      colName = 'Data di Nascita'
  }

  $('#modal-edit').modal('toggle')
  $('#modal-title-edit').text('Modifica ' + colName)

  $('#modal-body-edit').html(body)
}

// Listener del bottone del modal per la modifica
$('#btn-edit').click(()=>{
  var newVal = $('#edit').val();
  var field = $('#edit').attr('field');
  const id = parseInt($('#edit').attr('row-id'))
  var set = {}

  set[field] = newVal
  db.updateRow( 
      dbName, 
      dbPath, 
      where = {
          'id': id
      },
      set,
      (succ, msg)=>{
          if(succ){
              $('#table').bootstrapTable('updateCellById', {
                  'id': id,
                  'field': field,
                  'value': newVal
              })
          }
      }
  )

  $('#modal-edit').modal('toggle')

})

// Definisce la colonna Opt
function formatDelete(value, row, index) {
  return [
    '<a class="remove" href="javascript:void(0)" title="Remove">',
    '<i class="fa fa-trash"></i>',
    '</a>'
  ].join('')
}

// Definisce la colonna chip
function formatChip(value, row, index) {
  var ret = ''
  if(value == true){
      ret = [
          '<input type="checkbox" onClick="chipCheck(this, ' + row.id + ')" checked>',
      ].join('')
  }else{
      ret = [
          '<input type="checkbox" onClick="chipCheck(this, ' + row.id + ')">',
      ].join('')
  }
  return ret
}

// Definisce la colonna Elimina
function formatDelete(value, row, index) {
  var ret = ''
  if(value == true){
      ret = [
          '<input type="checkbox" onClick="deleteCheck(this, ' + row.id + ')" checked>',
      ].join('')
  }else{
      ret = [
          '<input type="checkbox" onClick="deleteCheck(this, ' + row.id + ')">',
      ].join('')
  }
  return ret
}

// Indica cosa succede quando un elemento elimina viene selezionato
function deleteCheck(element, rowId){
  db.updateRow(dbName, dbPath, 
      where = {'id': rowId},
      set = {Elimina: element.checked},
      (succ,msg)=>{
          console.log(msg)
      })
}

// Indica cosa succede quando un elemento chip viene selezionato
function chipCheck(element, rowId){
  var n = parseInt($('#chip-rows').html())
  if(element.checked){
      n++
  }else{
      n--
  }
  $('#chip-rows').html(n)

  db.updateRow(dbName, dbPath, 
      where = {'id': rowId},
      set = {Chip: element.checked},
      (succ,msg)=>{
          console.log(msg)
      })
}

// Seleziona tutti
$('#checkAll').click(function () {
  if(confirm('ATTENZIONE! Questa operazione potrebbe richiedere alcuni minuti, confermi?')){
      $('#table').bootstrapTable('togglePagination')
      var rows = $('#table').bootstrapTable('getData')
      rows.forEach((element)=>{check(element, true)})
      location.reload(true)
  }
})

// Deseleziona tutti
$('#uncheckAll').click(function () {
  if(confirm('ATTENZIONE! Questa operazione potrebbe richiedere alcuni minuti, confermi?')){
      $('#table').bootstrapTable('togglePagination')
      var rows = $('#table').bootstrapTable('getData')
      rows.forEach((element)=>{check(element, false)})
      location.reload(true)
  }
})

// Salva tabella json
$('#save').click(()=>{

})

// Elimina righe selezionate
$('#remove').click(()=>{

  del = []

  db.getRows(dbName, dbPath, 
    where = {
      Elimina: true
    },
    (succ,res)=>{
      if(succ){
        del = res
      }
  })

  if(del.length == 0){
    alert('Nessuna riga selezionata!')
    return
  }

  if(confirm('ATTENZIONE: Eliminare definitivamente le righe selezionate?')){ 
    del.forEach((elem) =>{
      db.deleteRow(dbName, dbPath, {'id': elem.id}, (succ, msg) => {
        /*
        if(succ){
          $('#table').bootstrapTable('remove', {
            field: 'id',
            values: [elem.id]
          })
        }
        */
      });
    })
  }

  location.reload(true);
  
  /*
  jsonObj = []

  read.forEach((e)=>{
    if(e.Chip || considerChip){
      var o = {
        Pettorale: '',
        Cognome: e.Cognome,
        Nome: e.Nome,
        Sesso: e.Sesso,
        Cat: '',
        Tessera: e.Numero,
        Team: e.IDSodalizio
      }
      o['Data di Nascita'] = e.DataNascita;
      o['Cod.Soc.'] = e.Codice;
  
      jsonObj.push(o)
    }
  })






  if(confirm('ATTENZIONE: Eliminare definitivamente le righe selezionate?')){
    if(e.Elimina){
      var o = {
        Pettorale: '',
        Cognome: e.Cognome,
        Nome: e.Nome,
        Sesso: e.Sesso,
        Cat: '',
        Tessera: e.Numero,
        Team: e.IDSodalizio
      }
      o['Data di Nascita'] = e.DataNascita;
      o['Cod.Soc.'] = e.Codice;
  
      jsonObj.push(o)
    }
  }
  */
})

// Elimina una riga 
function deleteRow (e, value, row, index) {
  db.deleteRow(dbName, dbPath, {'id': row.id}, (succ, msg) => {
      if(succ){
          $('#table').bootstrapTable('remove', {
              field: 'id',
              values: [row.id]
          })
      }else{
          alert(msg)
      }
  });
}