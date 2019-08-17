function calcolaCF(){
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
      console.log(err.message)
      $('#cf').val(err.message)
    }
}

function codFisInfo(){
    str = 'Per calcolare in modo corretto il codice fiscale ecco alcune linee guida: \n'
    str += '- Utilizzare esclusivamente il formato indicato per la data\n'
    str += '- Assicurarsi di avere selezionato il sesso\n'
    str += '- In caso di accenti NON utilizzare le lettere accentate ma il carattere \' (es. Cirie\')\n'
    str += '- La sigla della provincia deve essere in MAIUSCOLO\n'
    str += '- N.B. In alcuni (rarissimi) casi il codice fiscale potrebbe risultare differente da quello calcolato!\n'
    alert(str)
}


module.exports = {
    calcolaCF,
    codFisInfo
}