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
    if(field == 'Selez' || field == 'Opt' || field == 'Chip'){
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

// Listener per il bottone elimina riga
function deleteRow (e, value, row, index) {
    if(confirm('ATTENZIONE! Eliminare definitivamente la riga?')){
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
}

$('#checkAll').click(function () {
    if(confirm('ATTENZIONE! Questa operazione potrebbe richiedere alcuni minuti, confermi?')){
        $('#table').bootstrapTable('togglePagination')
        var rows = $('#table').bootstrapTable('getData')
        rows.forEach((element)=>{check(element, true)})
        location.reload(true)
    }
})

$('#uncheckAll').click(function () {
    if(confirm('ATTENZIONE! Questa operazione potrebbe richiedere alcuni minuti, confermi?')){
        $('#table').bootstrapTable('togglePagination')
        var rows = $('#table').bootstrapTable('getData')
        rows.forEach((element)=>{check(element, false)})
        location.reload(true)
    }
})

$('#save').click(()=>{

})