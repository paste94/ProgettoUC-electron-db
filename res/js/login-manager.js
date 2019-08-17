const keytar = require('keytar')
const service = 'gestore-gare-csain';
const account = 'account';
//keytar.deletePassword(service, account);
const secret = keytar.getPassword(service, account);
secret.then((result) => {
    
    if(result==null){
        //Mostra card per la generazione della password
        $('#card-ask-pwd').attr('hidden', true)
        $('#card-new-pwd').attr('hidden', false)

        $('#form-new-pwd').submit(function(event){
            let pwd = $('#new-pwd').val()
            let pwdRep = $('#new-pwd-rep').val()

            if(pwdRep === pwd){
                keytar.setPassword(service, account, pwd)
                alert('Password impostata correttamente!')
            }else{
                alert('Attenzione! Le due password non corrispondono, riprovare!')
                event.preventDefault()
            }
        })
    }else{
        $('#form-ask-pwd').submit(function(event){
            event.preventDefault()
            let pwd = $('#pwd').val()

            if(result === pwd){
                window.location = 'table-window.html'
            }else{
                alert('Attenzione! password errata!')
            }
        })
    }
});

$('#forgotten-pwd').click(()=>{
    if(confirm('ATTENZIONE! E\' possibile modificare la password ma il vecchio database verrà eliminato e sarà necessario crearne uno nuovo. Si desidera proseguire ugualmente?')){
        db.clearTable(dbName, (succ, msg) => {
            if (succ) {
                console.log(msg)
                keytar.deletePassword(service, account)
                alert('Tutto fatto. Prego digitare la nuova password.')
                location.reload(); 
            }
        })
    }
})

$('#change-pwd').click(()=>{
    $('#card-ask-pwd').attr('hidden', true)
    $('#card-change-pwd').attr('hidden', false)
    $('#form-change-pwd').submit(function(event){
        event.preventDefault()
        let old = $('#old-pwd').val()
        let newPwd = $('#txt-change-pwd').val()
        let newPwd2 = $('#txt-change-pwd-2').val()
        if(newPwd == '' || newPwd2 == '' || newPwd != newPwd2){
            alert('ATTENZIONE: Controllare che le due nuove password siano identiche!')
            return
        }

        secret.then((result) => {
            if(result != old){
                alert('La vecchia password non coincide')
                return
            }
            keytar.deletePassword(service, account)
            keytar.setPassword(service, account, newPwd)
            alert('Tutto fatto. Prego digitare la nuova password.')
            location.reload(); 
        })
        return
    })
})

$('#back').click(()=>{
    $('#card-change-pwd').attr('hidden', true)
    $('#card-ask-pwd').attr('hidden', false)
})
