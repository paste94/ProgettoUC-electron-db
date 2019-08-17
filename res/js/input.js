const functions =    require('./functions.js');
var jsonObjFromTable;

// Selezionare il file da caricare
function loadExcelFile(){
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
    
    if(keys.indexOf("cf sodalizio") > -1){
        jsonObjFromTable.forEach((elem)=>{
            elem.Codice = elem['cf sodalizio']
        })
    }

    if(jsonObjFromTable[0].Codice == 0){
        $('#modal-add-excel').modal('toggle') // Riferimento al listener di btn-add-excel
    }else{
        loadElements(jsonObjFromTable)
    }
}

// Usata per caricare il file excel con campi mancanti. Viene richiamato alla pressione del bottone del modal
function loadExcelFromModal(){
    var codiceSoc = $('#codice-soc-excel').val()
    var nomeSoc = $('#nome-soc-excel').val()
    jsonObjFromTable.forEach((e)=>{
        e.Codice = codiceSoc;
        e.IDSodalizio = nomeSoc
    })
    loadElements(jsonObjFromTable)
    $('#modal-add-excel').modal('toggle')
}

// Crea la tabella  partire dal file excel
async function loadElements(jsonObjFromTable){
    var progressBar = new ProgressBar({
        indeterminate: false,
        maxValue: jsonObjFromTable.length,
        browserWindow: {
            parent: null,
            modal: true,
            resizable: false,
            closable: false,
            minimizable: false,
            maximizable: false,
            width: 500,
            height: 170,
            webPreferences: {				
                nodeIntegration: true				
            }
        },
        text: 'Caricamento...',
        detail: 'Attendere prego...'
    });
    progressBar
            .on('completed', function() {
                //console.info(`completed...`);
                progressBar.detail = 'Task completed. Exiting...';
            })
            .on('aborted', function() {
                //console.info(`aborted...`);
            });
    jsonObjFromTable.forEach(element => { 
        progressBar.value += 1
        if(element.Numero != 0){
        db.deleteRow(dbName, 
            where = {
            CodFis: element.CodFis
            },
            (succ, result)=>{}
        )
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
        db.insertTableContent(dbName, o, (succ, msg) => {})
        $('#table').bootstrapTable('refresh', {'silent': 'true'})

        }
    });
    /*
    $('#modal-progress').modal("toggle")
    asyncFunc(jsonObjFromTable)
    $('#modal-progress').modal("toggle")
    */
    //await asyncFunc(jsonObjFromTable)
}

// Aggiungi una persona manualmente 
function addPerson(){
    var obj = {
        Selez:              false,
        Cognome:            $('#cognome').val(),
        Nome:               $('#nome').val(),
        Sesso:              $('#sesso').val(),
        DataNascita:        $('#data').val(),
        LuogoNascita:       $('#comune').val() + '(' + $('#prov').val() + ')',
        CodFis:             $('#cf').val(),
        Numero:             $('#tessera').val(),
        Codice:             $('#codice-soc').val(),
        IDSodalizio:        $('#nome-soc').val(),
        Chip:               'No' 
    }
  
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if(key != 'Selez' && key != 'Elimina' && obj[key] == ''){
          obj[key] = '-'
        }
      }
    }
  
    db.insertTableContent(dbName, obj, (succ, msg) => {
        if(succ){
            $('#table').bootstrapTable('refresh', {'silent': 'true'})
        }else{
            alert(msg);
        }
    })

    $('#add-modal').modal('toggle')
}

//Aggiungi file per i CF delle squadre
function loadTeamCF(){
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

    var progressBar = new ProgressBar({
        indeterminate: false,
        maxValue: jsonObjFromTable.length,
        browserWindow: {
            parent: null,
            modal: true,
            resizable: false,
            closable: false,
            minimizable: false,
            maximizable: false,
            width: 500,
            height: 170,
            webPreferences: {				
                nodeIntegration: true				
            }
        },
        text: 'Caricamento...',
        detail: 'Attendere prego...'
    });
    progressBar
            .on('completed', function() {
                //console.info(`completed...`);
                progressBar.detail = 'Task completed. Exiting...';
            })
            .on('aborted', function() {
                //console.info(`aborted...`);
            });

    jsonObjFromTable.forEach((element)=>{
        progressBar.value += 1
        db.getRows(dbName,
            {
                Codice: element.Codice
            },(succ,data)=>{
                data.forEach((row)=>{
                    db.updateRow(dbName,
                        where={
                            id: row.id
                        },
                        set={
                            IDSodalizio: element.Denominazione,
                            CFSocieta: element.CodiceFiscale
                        },
                        (succ,msg)=>{
                            if(!succ){
                                console.log(msg)
                            }
                        })
                })
            })
    })
    $('#table').bootstrapTable('refresh', {'silent': 'true'})


}

// Crea la select per scegliere il team nell'aggiunta manuale della persona
function defineSelectTeam(){
    body = functions.createTeamSelector

    $('#add-person-select-team').append(body)

    $('#add-modal').modal('toggle')

}

module.exports = {
    loadExcelFile,
    loadExcelFromModal,
    addPerson,
    loadTeamCF,
    defineSelectTeam
}