dbPath = db.getPath() + '\\database.json'


db.createTable(dbName, (succ, msg) => {
    console.log('creazione DB: ' + msg)
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
        title: 'Sel',
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