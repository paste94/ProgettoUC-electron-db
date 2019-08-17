const functions =    require('./js/functions.js');

db.createTable(dbName, (succ, msg) => {
    if(!succ){
      console.log('creazione DB: ' + msg)
    }
})

tableOpts = {
    pagination: true,
    search: true,
    url: dbPath,
    dataField: 'database',
    maintainSelected: true,
    pageList: "[10, 25, 50, 100, ALL]",
    pagination: true,
    sortable: true,
    checkboxHeader: false,
    uniqueId: 'id',
    selectItemName: 'selectItemName',
    showColumns: true,
    dataCache: false,
    trimOnSearch: false,
    columns: [{
        field: 'Selez',
        sortable: true,
        checkbox: true
    },{
      field: 'Chip',
      title: 'Chip',
      sortable: true,
      formatter: function(value, row, index){
        return formatChip(value, row, index);
      }
    },{
      field: 'Elimina',
      title: 'Elimina',
      sortable: true,
      formatter: function(value, row, index){
        return formatDelete(value, row, index);
      }
    },{
        field: 'Cognome',
        title: 'Cognome',
        sortable:true
    },{
        field: 'Nome',
        title: 'Nome',
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
        field: 'LuogoNascita',
        title: 'Luogo di Nascita',
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
        field: 'CFSocieta',
        title: 'Codice Fiscale Società',
        sortable:true
    },{
        field: 'id',
        visible: false
    }],
  
    onDblClickCell: function(field, value, row, element){
        editCell(field, value, row, element);
    },
    
    customSearch: function(data, text){
      //console.log(data)
      if(data.length>0){
        ret = []
        colName = Object.keys(data[0])
        text = text.toLowerCase()
        textArray = text.split(" ")
        
        ret = ret.concat(
          data.filter(function(row){
            //La variabile trovata serve a indicare quante parole ho trovato. Ogni volta che 
            //trovo una parola in una colonna aumento questo contatore. 
            //Alla fine, se il contatore è uguale al numero di parole da 
            //cercare è perchè le ho trovate tutte!
            var trovata = 0 
            textArray.forEach(function(word){
              colName.forEach(function(col){
                if(String(row[col]).toLowerCase().indexOf(word) > -1){
                  trovata++
                }
              })
            })
            
            //console.log(trovata)
  
            return trovata >= textArray.length
          })
        )
        
        uniq = [...new Set(ret)];
        //console.log(uniq)
  
        return uniq
      }
      return null
    },
    
    onCheck: function(row, element){
        check(row, true)
    },
  
    onUncheck: function(row, element){
        check(row, false)
    }
  }

$('#table').bootstrapTable(tableOpts)

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
  }
  else if(field == 'IDSodalizio' || field == 'Codice'){
    body += '<div class="row">'
    if(field == 'IDSodalizio'){
      // Value sarà Codice*IDSodalizio
      body += '<div class="col-6">'
      body += '<input id="edit" field="team" row-id=' + row.id + 'type="text" value="' + row.Codice + '"  class="form-control"></input>'
      body += '</div>'      
      body += '<div class="col-6">'
      body += '<input id="edit-nome-soc" row-id=' + row.id + 'type="text" value="' + value + '"  class="form-control"></input>'
      body += '</div>'
    }else{
      body += '<div class="col-6">'
      body += '<input id="edit" field="team" row-id=' + row.id + 'type="text" value="' + value +'"  class="form-control"></input>'
      body += '</div>'      
      body += '<div class="col-6">'
      body += '<input id="edit-nome-soc" row-id=' + row.id + 'type="text" value="' + row.IDSodalizio +'"  class="form-control"></input>'
      body += '</div>'      
    }
    body += '</div>'

    let select = functions.createTeamSelector
    $('#select-edit-team').attr('hidden', false)
    $('#select-edit-team').append(select)

  }
  else{
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
