var XlsxTemplate = require('xlsx-template');

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
        if(e.Chip == true || considerChip){

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
        o['Codice Fiscale Società'] = e.CFSocieta
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
        o['Codice Fiscale Società'] = e.CFSocieta
        jsonObj.push(o); // Stringa json che rappresenta la riga
    })
    $('#modal-select-team').modal('toggle')
    
    scaricaExcel(jsonObj);
}

// Scarica file CSAIN
function generateCSAIN(){
    if(typeof require !== 'undefined') XLSX = require('xlsx');

    var workbook = XLSX.readFile(__dirname + '\\excel\\CSAIN-template.xls', {cellNF: true, cellStyles: true});
    XLSX.writeFile(workbook, __dirname + '\\excel\\copia.xls');
    

    /*
    var selezionati;
    var jsonObj = [];

    db.getRows(dbName, {
        Selez: true
    }, (succ, result) => {
        console.log(succ + ' ' + result)
        selezionati = result
    });

    if(selezionati.length == 0) {// Controllo il numero di elementi selezionati
        alert('Attenzione, selezionare almeno una riga prima di proseguire!');
        return;
    };

    var toPrint = {
        Cognome: [],
        Nome: [],
        DataNascita: [],
        CodFis: [],
        CFSocieta: []
    }

    // Load an XLSX file into memory
    fs.readFile(path.join(__dirname, 'excel', 'CSAIN-template.xlsx'), function(err, data) {
        if(err) console.log(err + ' ' + data)

        // Create a template
        var template = new XlsxTemplate(data);

        
        // Replacements take place on first sheet
        var sheetNumber = 1;

        // Set up some placeholder values matching the placeholders in the template
        selezionati.forEach((e)=>{
            toPrint.Cognome.push(e.Cognome)
            toPrint.Nome.push(e.Nome)
            toPrint.DataNascita.push(e.DataNascita)
            toPrint.CodFis.push(e.CodFis)
            toPrint.CFSocieta.push(e.CFSocieta)
        })

        // Perform substitution
        template.substitute(sheetNumber, selezionati);

        // Get binary data
        var data = template.generate();

        fs.writeFile('./generated.xlsx', data, (err)=>{
            console.log(err)
        })

    });
    */
}

// Scarica file excel
function scaricaExcel(jsonObj){  
    // Mostra la finestra per selezionare dove salvare il file 
    try{
      var filename = dialog.showSaveDialog({
        filters: [
            {
            name: 'Excel (.xls)',
            extensions: ['xls']
            },
            {
                name: 'Excel 2007-2019 (.xlsx)',
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
        if(err.message != "Cannot read property 'slice' of undefined")
            alert(err)
    }
    
}

// Definisce il modal usato per selezionare il team (per squadre)
function defineTeamModal(){
    $('#modal-select-team').modal('toggle')
    
    var read = $('#table').bootstrapTable('getSelections');
    var elencoSquadre = []

    // Inserisci tutte le squadre dentro l'array
    read.forEach((e)=>{
        elencoSquadre.push({
            Codice: e.Codice.replace(/\s/g, ''),
            IDSodalizio: e.IDSodalizio
        })
    })

    const result = []
    const map = new Map();
    //Mette dentro result i valori distinti di elencoSquadre
    for (const item of elencoSquadre) {
        if(!map.has(item.Codice)){
            map.set(item.Codice, true);    // set any value to Map
            result.push({
                Codice: item.Codice,
                IDSodalizio: item.IDSodalizio
            });
        }
    }

    var body  = '<select class="form-control" id="team-select">';
    result.forEach((element)=>{
        //console.log(element.Codice + '--' + element.IDSodalizio)
        body += '<option value=' + element.Codice + '>' + element.IDSodalizio + '</option>'
    })  
    body += '</select>'

    $('#modal-body-team').html(body)

    
    
    /*

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
        console.log(element.Codice + '--' + element.IDSodalizio)
        body += '<option value=' + element.Codice + '>' + element.IDSodalizio + '</option>'
      })
      body += '</select>'
  
      $('#modal-body-team').html(body)
  
    })

    */
  }

module.exports = {
    generateMYSDAM,
    generateClassifica,
    generateEventi,
    generateSquadre,
    generateCSAIN,
    defineTeamModal
}