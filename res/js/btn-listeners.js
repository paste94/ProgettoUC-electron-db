//--lISTENER BOTTONI DELLA SIDEBAR--------------------------------------------------------------------------//

$('#add-team-cf').click(input.loadTeamCF)

// Carica file XLS
$('#load-file').click(input.loadExcelFile)

// Carica file excel non società vercelli
$('#btn-add-excel').click(input.loadExcelFromModal)

// MYSDAM
$('#mysdam').click(output.generateMYSDAM)

// CLASSIFICA
$('#classifica').click(output.generateClassifica)

// EVENTI
$('#eventi').click(output.generateEventi)

// Bottone che genera il MODAL per la selezione della squadra
$('#eventi-squadra').click(output.defineTeamModal)

// Bottone che genera il file CSAIN
$('#generate-csain').click(output.generateCSAIN)

// SQUADRE
$('#btn-team').click(output.generateSquadre)


//--AGGIUNTA MANUALE DI UNA PERSONA--------------------------------------------------------------------------//

// Click del bottone
$('#add-person').click(input.defineSelectTeam)

// Aggiungi una riga manualmente 
$('#add-row').click(input.addPerson)

//Calcola Codice Fiscale in automatico
$('#calcola-cf').click(codFisJS.calcolaCF)

// Mstra un alert con le informazioni necessarie per costruire il codice fiscale
$('#calcola-cf-info').click(codFisJS.codFisInfo)

//Metti a bianco tutte le caselle del modal per aggiunta di una persona
$('#add-modal').on('hidden.bs.modal', function() { 
  $('#code').modal('hide');
  $('#cognome').val('')
  $('#nome').val('')
  $('#sesso').val('Sel...')
  $('#data').val('')
  $('#cf').val('')
  $('#tessera').val('')
  $('#codice-soc').val('')
  $('#nome-soc').val('')
});


// Listener del bottone del modal per la modifica
$('#btn-edit').click(()=>{
  var newVal = $('#edit').val();
  if(newVal == ''){
    newVal = '-'
  }
  var field = $('#edit').attr('field');
  const id = parseInt($('#edit').attr('row-id'))
  var set = {}
  if(field == 'LuogoNascita'){
    newVal += '(' + $('#prov-edit').val() + ')'
    //console.log(newVal)
  }else if(field == 'team'){
    set['Codice'] = newVal
    set['IDSodalizio'] = $('#edit-nome-soc').val();
    db.updateRow( 
      dbName, 
      where = { 
          'id': id
      },
      set,
      (succ, msg)=>{  
          if(succ){
            $('#table').bootstrapTable('refresh', {'silent': 'true'})
            $('#select-edit-team').attr('hidden', true)
          }
      }
    )
  }
  set[field] = newVal
  db.updateRow( 
      dbName, 
      where = { 
          'id': id
      },
      set,
      (succ, msg)=>{
          if(succ){
            $('#table').bootstrapTable('refresh', {'silent': 'true'})
          }
      }
  )

  $('#modal-edit').modal('toggle')

})


// Seleziona tutti
$('#check-all').click(function () {
  if(confirm('ATTENZIONE! Questa operazione potrebbe richiedere alcuni minuti, confermi?')){
    db.getRows(dbName, {
      Selez: false
    }, (succ, res) => {
      if(res.length == 0) return
      var progressBar = new ProgressBar({
          indeterminate: false,
          maxValue: res.length,
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
                  progressBar.detail = 'Completato';
              })
              .on('aborted', function() {
                  console.info(`Interrotto`);
              });
      res.forEach((element)=>{
        progressBar.value += 1
        db.updateRow(dbName,
          where={
            "id": element.id
          }, 
          set = {
            Selez: true
          }, 
          (succ, msg) => {});  
      })

      $('#table').bootstrapTable('refresh', {'silent': 'true'})
      if(succ){
        db.count(dbName, (succ, data)=>{
          $('#selected-rows').html(data)
        })
      }

    })
  }
})

// Bottone seleziona da file
$('#check-from-file').click(function(){
  /* Dialog per selezionare il file da caricare  */
  var fileName = dialog.showOpenDialog({
  filters: [
      {
      name: 'Testo (.txt)',
      extensions: ['txt']
      }
  ]
  })
  
  if(fileName == null){
      return
  }
  /*Parsing del file */
  var totalString = fs.readFileSync(fileName[0]).toString('utf-8');

  var support = totalString.split("#INSERT INTO `expanagrafica` (`CodAnagrafica`, `TipoAnagrafica`, `Nome`, `Cognome`, `Sesso`, `DataDiNascita`, `LuogoDiNascita`, `Indirizzo`, `CAP`, `Citta`, `CodProvincia`, `CodStato`, `Telefono`, `Cellulare`, `EMail`, `Attivo`) VALUES");
  var support2 = support[1].split("#;#drop table IF EXISTS expsocieta#;#CREATE TABLE IF NOT EXISTS `expsocieta` (");
  var values = support2[0].split("(");
  values.shift() //Rimuove il primo elemento che è sempre ""
  var progressBar = new ProgressBar({
    indeterminate: false,
    maxValue: values.length,
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

  /** Progressbar */
  progressBar
          .on('completed', function() {
              progressBar.detail = 'Completato';
          })
          .on('aborted', function() {
              console.info(`Interrotto`);
          });
  
  notFound = "!!! ELEMENTI NON TROVATI !!!\n--------------------------------\n\n"
  values.forEach(value=>{
    progressBar.value += 1
    var data = value.split(",");
    var name = data[2].replace(/'/g, '').trim()
    name = name.charAt(0) + name.slice(1).toLowerCase()
    var surname =  data[3].replace(/'/g, '').trim()
    surname = surname.charAt(0) + surname.slice(1).toLowerCase()
    //var strDate = data[5].replace(/'/g, '').trim().split('-')
    //var birth = strDate[2].replace(/^0+/, '') + '/' + strDate[1].replace(/^0+/, '') + '/' + strDate[0]

    console.log('Cerco -' + name + '- -' +  surname)
    

    db.getRows(dbName, 
      where = {
        'Nome': name,
        'Cognome': surname
      }, 
      (succ, res)=>{
        if(res != ''){
          db.updateRow(dbName, 
            where = {
              'id': res[0].id
            },
            set = {
              'Selez': true
            }, (succ, msg)=>{
              console.log(msg)
            })
        }else{
          notFound += name + ", " + surname + "\n"
        }
      })
  })
  // Aggiorna il numero di elementi selezionati
  db.getRows(dbName, {
    Selez: true
  }, (succ, result) => {
    $('#selected-rows').html(result.length)
  })


  if(notFound.length>0){
    var newFileName = fileName.toString().replace(/\.txt/, "_not_found.txt")
    fs.writeFile(newFileName, notFound, (err)=>{
      if(err){
        console.log('ERROR: ' + err.message)
      }else{
        console.log('File salvato in ' + newFileName)
      }
    })
    shell.openExternal(newFileName)

  }
  $('#table').bootstrapTable('refresh', {'silent': 'true'})


  
})


// Deseleziona tutti
$('#uncheck-all').click(function () {
  if(confirm('ATTENZIONE! Questa operazione potrebbe richiedere alcuni minuti, confermi?')){
    db.getRows(dbName, {
      Selez: true
    }, (succ, res) => {
      if(res.length == 0) return
      var progressBar = new ProgressBar({
          indeterminate: false,
          maxValue: res.length,
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
                  progressBar.detail = 'Completato';
              })
              .on('aborted', function() {
                  console.info(`Interrotto`);
              });
      res.forEach((element)=>{
        progressBar.value += 1
        db.updateRow(dbName,
          where={
            "id": element.id
          }, 
          set = {
            Selez: false
          }, 
          (succ, msg) => {});  
      })

      $('#table').bootstrapTable('refresh', {'silent': 'true'})
      if(succ){
        $('#selected-rows').html(0)
      }

    })
  }
})

// Elimina righe selezionate
$('#remove').click(()=>{

  del = []

  db.getRows(dbName,
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
    var nChip = 0; nSelez = 0;
    del.forEach((elem) =>{
      if(elem.Chip) nChip++;
      if(elem.Selez) nSelez++;
      db.deleteRow(dbName, {'id': elem.id}, (succ, msg) => {
        
      });
    })
    var nChipOld = parseInt($('#chip-rows').html())
    var nSelezOld = parseInt($('#selected-rows').html())
    $('#chip-rows').html(nChipOld - nChip)
    $('#selected-rows').html(nSelezOld - nSelez)


  } 

  //location.reload(true);
  $('#table').bootstrapTable('refresh', {'silent': 'true'})
})

// Elimina una riga 
function deleteRow (e, value, row, index) {
  db.deleteRow(dbName, {'id': row.id}, (succ, msg) => {
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

//Mostra il modal dei credits
$('#credits').click(()=>{
  $('#modal-credits').modal('toggle') // Riferimento al listener di btn-add-excel
})

const shell = require('electron').shell;

// assuming $ is jQuery
$(document).on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
});

$('#mostra-db').click(()=>{
  shell.showItemInFolder(dbPath)
})

$('#changelog').click(()=>{
  shell.openItem('changelog.txt');
})

//Deseleziona chip
$('#uncheck-chip').click(()=>{
  db.getRows(dbName, {
    Chip: true
  }, (succ, res) => {
    res.forEach((element)=>{
      db.updateRow(dbName,
        where={
          "id": element.id
        }, 
        set = {
          Chip: false
        }, 
        (succ, msg) => {});  
    })

    $('#table').bootstrapTable('refresh', {'silent': 'true'})
    if(succ){
      $('#chip-rows').html(0)
    }
  })
})

$('#restore-db').click(backup.restoreDB)

$('#add-person-select-team').on('change', function() {
  if(this.value == '-'){
    $('#codice-soc').val('')
    $('#nome-soc').val('')
    return
  }
  let splitted = this.value.split('*')
  const cod = 1, nome = 0 
  $('#codice-soc').val(splitted[cod])
  $('#nome-soc').val(splitted[nome])
  //console.log( splitted );
});

// Listener del cambiamento del select per la modifica del team
$('#select-edit-team').on('change', function(){
  if(this.value == '-'){
    $('#edit-codice').val('')
    $('#edit-nome-soc').val('')
    return
  }
  let splitted = this.value.split('*')
  const cod = 1, nome = 0 
  $('#edit-codice').val(splitted[cod])
  $('#edit-nome-soc').val(splitted[nome])
  //console.log( splitted );
})