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
function loadElements(jsonObjFromTable){
    jsonObjFromTable.forEach(element => { 
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
        }
    });
    alert('Terminato!')
    $('#table').bootstrapTable('refresh', {'silent': 'true'})
}

module.exports = {
    loadExcelFile,
    loadExcelFromModal
}