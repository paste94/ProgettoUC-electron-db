var jsonObjFromTable;

// Carica file XLS
$('#load-file').click(function(){
    /* Dialog per selezionare il file da caricare  */
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
    console.log('Codice' in jsonObjFromTable)
    if(!('Codice' in jsonObjFromTable)){
      $('#modal-add-excel').modal('toggle') // Riferimento al listener di btn-add-excel
    }else{
      loadElements(jsonObjFromTable)
    }
})// Fine carica file XLS

$('#btn-add-excel').click(()=>{
  var codiceSoc = $('#codice-soc-excel').val()
  var nomeSoc = $('#nome-soc-excel').val()
  jsonObjFromTable.forEach((e)=>{
    e.Codice = codiceSoc;
    e.IDSodalizio = nomeSoc
  })
  loadElements(jsonObjFromTable)
})

function loadElements(jsonObjFromTable){
  jsonObjFromTable.forEach(element => {
    if(element.Numero != 0){
      var o = {
        Selez: false,
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
 
  var read = $('#table').bootstrapTable('getSelections');
  if(read.length == 0) {// Controllo il numero di elementi selezionati
    alert('Attenzione, selezionare almeno una riga prima di proseguire!');
    return;
  }

  jsonObj = []

  read.forEach((e)=>{
    if(e.Chip){
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
  scaricaExcel(jsonObj);
})

// Crea file excel
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