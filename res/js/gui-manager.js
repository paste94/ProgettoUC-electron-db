// Mostra il numero di elementi selezionati
db.getRows(dbName, {
    Selez: true
  }, (succ, result) => {
    $('#selected-rows').html(result.length)
})

// Mostra il numero di elementi con il chip selezionato
db.getRows(dbName, {
    Chip: true
  }, (succ, result) => {
    $('#chip-rows').html(result.length)
})