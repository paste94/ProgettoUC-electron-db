// MYSDAM
function generateMYSDAM(){
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
}

// Genera file Classifica
function generateClassifica(){
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
    scaricaExcel(jsonObj)
}

// Genera file Eventi
function generateEventi(){
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
}

// Scarica file per Squadre
function generateSquadre(){
    var selezionati
    db.getRows(dbName, {
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
        o['Codice Società'] = e.Codice
        o['Nome Società'] = e.IDSodalizio
        jsonObj.push(o); // Stringa json che rappresenta la riga
    })
    $('#modal-select-team').modal('toggle')
    
    scaricaExcel(jsonObj);
}

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
    }catch(err){
        alert(err)
    }
    
}

module.exports = {
    generateMYSDAM,
    generateClassifica,
    generateEventi,
    generateSquadre
}