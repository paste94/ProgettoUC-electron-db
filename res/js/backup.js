let min = 5

setInterval(function() {
//setImmediate(function(){
  //console.log('Backup!')
    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear()
    var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    let dbBackupPath = userData + '\\backup\\database_backup_' + date + '_' + time + '.json';

    // Crea una nuova cartella se non esiste
    if(!fs.existsSync(userData + '\\backup')){
      fs.mkdirSync(userData + '\\backup')
    }

    // Leggi tutti i file nella cartella 
    fs.readdirSync(userData + '\\backup').forEach(file => {
      // Elimina tutti i file nella cartella
      fs.unlink(userData + '\\backup\\' + file, (err)=>{
        if(err) throw err
      })
    });
    
    //Crea il nuovo file 
    fs.copyFileSync(dbPath, dbBackupPath);
    
    
}, min * 60 * 1000); 

function restoreDB(){
  if(!fs.existsSync(userData + '\\backup')){
    alert('Non è stata trovata alcuna cartella per il backup')
    return
  }
  fs.readdirSync(userData + '\\backup').forEach(file => {

    // Estrai la data e l'ora dell'ultimo backup generato 
    file = remove_character('database_backup_', file)
    file = remove_character('.json', file)
    let splitted = file.split('_')
    splitted[0] = splitted[0].replace(/-/g, '/')
    splitted[1] = splitted[1].replace(/-/g, ':')

    if(confirm('ATTENZIONE! QUESTA OPERAZIONE NON PUO\' ESSERE ANNULLATA!\n\n Questa operazione cancellerà il database attuale (con anche le selezioni) e ripristinerà quella del ' + splitted[0] + ', ore ' + splitted[1] + '. Confermare?' )){
      fs.renameSync(userData + '\\database.json', userData + '\\database_old.json')
      fs.readdirSync(userData + '\\backup').forEach(file => {
        fs.copyFileSync(userData + '\\backup\\' + file, userData + '\\database.json');
      });
      location.reload()
    }
  });
  
}

function remove_character(str_to_remove, str) {
  let reg = new RegExp(str_to_remove)
  return str.replace(reg, '')
}

module.exports = {
  restoreDB
}