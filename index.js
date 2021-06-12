const APIsteam = require('steamapi');
const config = require('./config.json');
const usuario = new APIsteam(config.KeySteam);

var Tentativas = 0;
let checados = [];

var nome = () => {
    var resultado = '';
    var caracteres = 'abcdefghijklmnopqrstuvwxyz-_1234567890';
    for (var i = 0; i < config.caracteres; i++)
        resultado += caracteres.charAt(Math.floor(Math.random() * 38));

    if (checados.indexOf(resultado) == -1)
        checados.push(resultado);
    else {
        Tentativas++;
        if (Tentativas > config.loops)  
          checados = [], Tentativas = 0;

        return 0;
    }

    return resultado;
};

setInterval(() => {
    let n = nome();
    if (!n)
        return;

    usuario.resolve(n).then(id => {
        console.log(`\x1B[1m[ \x1B[31mF\x1B[37m ]\x1B[3m já usada: ${n}.`)
    }).catch(e => {
        switch (e.message) {
            case "Forbidden":
                console.log("\x1B[1m[ \x1B[33mERRO\x1B[37m ]\x1B[3m API zoada");
                break;
            case "No match":
                console.log(`\x1B[1m[ \x1B[32mFÁCIL\x1B[37m ]\x1B[3m PEGA LOGO: ${n}.`);
                process.exit(0);
                break;
            default:
                console.log(`\x1B[1m[ \x1b[36mUNKNOWN\x1B[37m ]\x1B[3m ${e.message}.`);
                break;
        }
    });
}, config.tempoMS);
