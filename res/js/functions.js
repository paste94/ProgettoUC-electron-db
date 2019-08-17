function createTeamSelector(){
    var read = $('#table').bootstrapTable('getData');
    //console.log(read)
    var elencoSquadre = []

    // Inserisci tutte le squadre dentro l'array
    read.forEach((e)=>{
        try { //Se il campo "codice" non esiste, non fare niente (senza questo controllo non permette più l'inserimento di alcun corridore)

            elencoSquadre.push({
                    Codice: e.Codice.replace(/\s/g, ''),
                    IDSodalizio: e.IDSodalizio
            })
        } catch (error) {
            console.log(error)
        }
    })

    
    const result = []
    const map = new Map();
    //Mette dentro result i valori distinti di elencoSquadre
    for (const item of elencoSquadre) {
        if(!map.has(item.Codice)){
            map.set(item.Codice, true);    // set any value to Map
            result.push({
                Codice: item.Codice,
                IDSodalizio: item.IDSodalizio
            });
        }
    }

    // Ordina le squadre per nome 
    result.sort((a,b) => (a.IDSodalizio > b.IDSodalizio) ? 1 : ((b.IDSodalizio > a.IDSodalizio) ? -1 : 0)); 

    // Crea la select
    var body  = '';
    body += '<option value="-">Nessuno</option>'
    result.forEach((element)=>{
        teamVal = element.IDSodalizio + '*' + element.Codice
        teamStr = element.IDSodalizio + '(' + element.Codice + ')'
        body += '<option value="' + teamVal + '">' + teamStr + '</option>'
    })

    return body
}

module.exports = {
    createTeamSelector
}