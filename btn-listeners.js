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

// Bottone che genera il modal per la selezione della squadra
$('#eventi-squadra').click(function(){
  defineTeamModal();
})

// SQUADRE
$('#btn-team').click(output.generateSquadre)

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
      LuogoNascita:       $('#comune').val() + '(' + $('#prov').val() + ')',
      CodFis:             $('#cf').val(),
      Numero:             $('#tessera').val(),
      Codice:             $('#codice-soc').val(),
      IDSodalizio:        $('#nome-soc').val(),
      Chip:               'No' 
  }

  console.log(Object.keys(obj).length)

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
          //$('#table').bootstrapTable('append',obj);
      }else{
          alert(msg);
      }
  })
  
  $('#add-modal').modal('toggle')
})


//Calcola Codice Fiscale in automatico
$('#calcola-cf').click(()=>{
  console.log(codFis)
  nome = $('#nome').val()
  cognome = $('#cognome').val()
  sesso = $('#sesso').val()
  data = $('#data').val()
  dataArray = data.split('/')
  giorno = parseInt(dataArray[0])
  mese = parseInt(dataArray[1])
  anno = parseInt(dataArray[2])
  comune = $('#comune').val()
  prov = $('#prov').val()
  try{
    var cf = codFis.CalcolaCodiceFiscale.compute({
      name: nome,
      surname: cognome,
      gender: sesso,
      day: giorno,
      month: mese,
      year: anno,
      birthplace: comune, 
      birthplace_provincia: prov
    });
    
    $('#cf').val(cf)
  }catch(err){
    alert(err.message)
  }
})

$('#calcola-cf-info').click(()=>{
  str = 'Per calcolare in modo corretto il codice fiscale ecco alcune linee guida: \n'
  str += '- Utilizzare esclusivamente il formato indicato per la data\n'
  str += '- Assicurarsi di avere selezionato il sesso\n'
  str += '- In caso di accenti NON utilizzare le lettere accentate ma il carattere \' (es. Cirie\')\n'
  str += '- La sigla della provincia deve essere in MAIUSCOLO\n'
  str += '- N.B. In alcuni (rarissimi) casi il codice fiscale potrebbe risultare differente da quello calcolato!\n'
  alert(str)
})

//Metti a bianco tutte le caselle del modal
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
  console.log(value)
  var body = ''
  if(field == 'CodFis'){
    body += '<div class="row">'
    body +=   '<div class="col-6">'
    body +=     '<label for="cf">Cognome</label>'
    body +=     '<input id="edit-cf-cognome" type="text" value='+row.Cognome+' disabled class="form-control"></input>'
    body +=   '</div>'
    body +=   '<div class="col-6">'
    body +=     '<label for="cf">Nome</label>'
    body +=     '<input id="edit-cf-nome" type="text" value="'+row.Nome+'" disabled class="form-control"></input>'
    body +=   '</div>'
    body += '</div>'
    body += '<br>'

    body += '<div class="row">'
    body +=   '<div class="col-6">'
    body +=     '<label for="cf">Sesso</label>'
    body +=     '<input id="edit-cf-sesso" type="text" value="'+row.Sesso+'" disabled class="form-control"></input>'
    body +=   '</div>'
    body +=   '<div class="col-6">'
    body +=     '<label for="cf">Data Nascita</label>'
    body +=     '<input id="edit-cf-data-nascita" type="text" value="'+row.DataNascita+'" disabled class="form-control"></input>'
    body +=   '</div>'
    body += '</div>'
    body += '<br>'

    body += '<div class="row">'
    body +=   '<div class="col-6">'
    body +=     '<label for="cf">Luogo di nascita</label>'
    body +=     '<input id="edit-cf-sesso" type="text" value="'+row.LuogoNascita+'" disabled class="form-control"></input>'
    body +=   '</div>'
    body += '</div>'
    body += '<br>'

    body += '<div class="row">'
    body +=   '<div class="col-12">'
    body +=     '<label for="cf">Codice Fiscale</label>'
    body +=     '<div class="input-group mb-3">'
    body +=       '<input id="edit" field=' + field + ' row-id=' + row.id + ' type="text" value="' + value + '"  class="form-control"></input>'
    body +=       '<div class="input-group-prepend">'
    body +=         '<button class="btn btn-outline-secondary" onClick=\'calcolaCF(' + row.id + ')\' type="button">Calcola</button>'
    body +=         '<button class="btn btn-outline-secondary" id="calcola-cf-info" type="button">?</button>'
    body +=       '</div>'    
    body +=     '</div>'    
    body +=   '</div>'    
    body += '</div>'    
  }
  else if(field == 'LuogoNascita'){
    comune = '-'
    prov = '-'
    try{
      split = row.LuogoNascita.split('(')
      comune = split[0]
      prov = split[1].substring(0, split[1].length-1)
    }catch{
    }
    
    body +=   '<label for="data">Luogo di nascita (Assicurarsi che la sigla della provincia sia in MAIUSCOLO</label>'
    body +=   '<div class="input-group">'
    body +=     '<input type="text" id="edit" field=' + field + ' row-id=' + row.id + ' value="'+ comune +'" class="form-control">'
    body +=     '<input type="text" id="prov-edit" placeholder="Prov (sigla)" value="'+ prov +'" class="form-control">'
    body +=   '</div>'
  }
  else if(field == 'Sesso'){
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
      body += '<input id="edit" field="' + field + '" row-id=' + row.id + ' type="text" value="' + value + '"  class="form-control"></input>'
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

/* Calcola il codice fiscale nell'edit */
function calcolaCF(rowID){
  db.getRows(dbName, {
    id: parseInt(rowID),
  }, (succ, result) => {
    row = result[0]
    
    if(row.Cognome == '' || row.Cognome == '-'){
      alert('Manca il cognome!')
    }
    if(row.Nome == '' || row.Nome == '-'){
      alert('Manca il nome!')
    }
    if(row.Sesso != 'F' && row.Sesso == 'S'){
      alert('Il sesso è sbagliato!')
    }
    if(row.Cognome == '' || row.Cognome == '-'){
      alert('Manca il cognome!')
    }
    try{
      str = row.LuogoNascita.split('(')
      comune = str[0]
      prov = str[1].substring(0, str[1].length-1)
    }catch(e){
      alert('Il luogo di nascita è scorretto. Controllare che sia nel formato comune(PROV)')
    }
    try{
      splitted = row.DataNascita.split('/')
    }catch{
      alert('La data di nascita è scorretta! Controllare che sia nel formato GG/MM/AAAA')
    }
    try{
      var cf = codFis.CalcolaCodiceFiscale.compute({
        name: row.Nome,
        surname: row.Cognome,
        gender: row.Sesso,
        day: splitted[0],
        month: splitted[1],
        year: splitted[2],
        birthplace: comune, 
        birthplace_provincia: prov
      });
      
      $('#edit').val(cf)
    }catch(err){
      alert(err.message)
    }
  })
}
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
    console.log(newVal)
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
  newCheck = ''
  if(element.checked){
    newCheck = '<input type="checkbox" onClick="deleteCheck(this, ' + rowId + ')" checked>'
  }else{
    newCheck = '<input type="checkbox" onClick="deleteCheck(this, ' + rowId + ')">'
  }
  db.updateRow(dbName,
      where = {'id': rowId},
      set = {Elimina: element.checked},
      (succ,msg)=>{
        $('#table').bootstrapTable('refresh', {'silent': 'true'})
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

  db.updateRow(dbName,
      where = {'id': rowId},
      set = {Chip: element.checked},
      (succ,msg)=>{
        $('#table').bootstrapTable('refresh', {'silent': 'true'})
      })
}

// Seleziona tutti
$('#checkAll').click(function () {
  if(confirm('ATTENZIONE! Questa operazione potrebbe richiedere alcuni minuti, confermi?')){
    db.getRows(dbName, {
      Selez: false
    }, (succ, res) => {
      console.log(succ)
      console.log(res)
      res.forEach((element)=>{
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
      alert('Operazione terminata!')

    })
  }
})

// Deseleziona tutti
$('#uncheckAll').click(function () {
  if(confirm('ATTENZIONE! Questa operazione potrebbe richiedere alcuni minuti, confermi?')){
    db.getRows(dbName, {
      Selez: true
    }, (succ, res) => {
      //console.log("Success: " + succ);
      console.log(succ)
      console.log(res)
      res.forEach((element)=>{
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
      alert('Operazione terminata!')

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
    del.forEach((elem) =>{
      db.deleteRow(dbName, {'id': elem.id}, (succ, msg) => {
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
  })
})
//electron-packager . GestoreGareCSAIN --overwrite --icon=icons/bike-ico.ico --asar