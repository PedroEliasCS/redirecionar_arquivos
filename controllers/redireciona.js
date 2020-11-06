let controller = {}
let cont = 0
const fs = require('fs')



controller.ultimoDia = async (req, res) => {
    await fs.readFile('./ultimoDia.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).send('pedro')
        } else {
            let a = JSON.parse(data)
            res.status(200).send(a.data + '<br> arquivos processados : ' + cont)
        }
    })
}


const deleteDest = async (dir) => { // deleta 
    try {
        let pastas = ['dp', 'fiscal', 'contabil']
        fs.readdir(dir, async (err, list) => { // lista todos os nome dos arquivos
            if (err) {
                logErr(e)
                return
            }
            for (let prop in list) { // passa dentro da lista arquivo por arquivo
                fs.stat(dir + list[prop], async (err, file) => { // abri descrição do arquivo
                    if (err) { // caso algo de errado
                        logErr(err)
                        return
                    } else { // caso de certo
                        try {
                            if (file.isDirectory() == true) { // apaga as pastas do diretorio e cria vazias
                                fs.rmdirSync(dir + list[prop], { // apaga as pastas carregadas
                                    recursive: true
                                });

                            } else if (file.isFile() == true) { // se algum arquivo for criado 
                                logErr('não deveria ter arquivos aqui') // reportar
                                fs.unlink(dir + list[prop], (err) => {
                                    if(err) logErr(err)
                                }) // deletar o arquivo
                            }
                        } catch (e) {
                            logErr(e)
                        }
                    }
                })
            }
            setTimeout(() => {
                for(let prop in pastas){
                    fs.mkdirSync(dir + pastas[prop]);
                }
            }, 2000);
        })
    } catch (e) {
        logErr(e)
        return
    }
}

const anoProcessadoF = (dir) => { // faz o processamento do ano atual
    fs.readFile('./ultimoDia.json', 'utf8', (err, data) => { // faz a leitura do json
        if (err) { // caso algo da errado
            console.log(err)
        } else { // caso de certo
            let json = JSON.parse(data) // converta o data Json para JSON 
            // let diaprocessado = json.data // acha a data atual
            // diaprocessado = (new Date(diaprocessado)) // separa o ano processado
            // console.log(diaprocessado)
            let dataAtual = new Date() // data atual
            //let anoAtual = dataAtual.getFullYear() // só o ano atual 
            //if (diaprocessado < dataAtual) { // se anos diferirem
            json.data = dataAtual // troca a data atual do json 
            json = JSON.stringify(json) // converte em json a data atual
            fs.writeFile('./ultimoDia.json', json, 'utf8', (err) => { //  sobreescreve arquivo json
                if (err) { // caso algo de errado
                    logErr(err) // chama o log erro
                    return
                } else { // deu certo?
                    console.log('data atualizada')
                    deleteDest(dir) // chama a function que deleta 
                }
            })
            // } // else {} caso  o ano seja igual não fazer nada
        }
    })
}



const logErr = (e) => {
    // melhorar essa função para criar
    // um txt de log

    console.log(e)
    return
}

const random = () => Math.floor(Math.random() * 100 + 1) // numero randomico




const copia = async (dir, destino) => { // copia o arquivo
    try {

        // destino
        // isso aqui tem de vir do usuario

        // console.log(destino)
        let ext = dir.split('.').pop() // separa a extenção
        if (ext != 'pdf') return
        let nomeArq = dir.split('/').pop() // separa somente o nome do arquivo
        let nomeDestino = (nomeArq.split('.')) + (Date.now() * random()) // cria um nome do arquivo
        //  console.log(dir)
        fs.copyFile(dir, `${destino}/${nomeDestino}.${ext}`, "utf8", (err) => {
            if (err) {
                logErr(err)
            } else {
                // console.log(cont)
                cont++
            }
        })

    } catch (e) {
        logErr(e)
        return
    }
}

const mesIndexOf = (ano, dir) => { // faz a divisão dos meses
    if ((dir.indexOf(`/${ano}/`)) != '-1' || dir.indexOf(`/${ano-1}/12/`) != '-1') {
        return true // se passar no filtro
    }
}

const filtros = async (dir) => { // faz a filtragem da informação
    let ano = (new Date()).getFullYear()
    // checa se informação é do DP

    if (mesIndexOf(ano, dir) === true) {
        // grupo DP
        if (dir.indexOf('/Folha') != '-1' || dir.indexOf('/FOLHA') != '-1') { // procura informações de nome Folha
            // se o mes e o ano contem na SRC 
             copia(dir, '/Users/peedr/Desktop/destino/dp') // chama a function que copia
        };
        // grupo fiscal
        if (dir.indexOf('/G5') != '-1' || dir.indexOf('/g5') != '-1'){
            copia(dir, '/Users/peedr/Desktop/destino/fiscal')
        }
    }
}

const stat = async (dir) => { // um unico arquivo chega nesse passo 
    try {

        fs.stat(dir, (err, file) => { // abre a descrição do arquivo
            if (err) {
                logErr(err)
                return
            } {
                if (file.isDirectory() === true) {
                    readdir(dir)
                    //console.log('pasta')
                } else if ((file.isFile()) == true) {
                    //console.log('arquivo')
                    filtros(dir)
                }
            }
        })
    } catch (e) {
        logErr(e)
    }
}

const readdir = async (dir) => { // lista os nomes dos arquivos das pasta 
    try {
        await fs.readdir(dir, (err, path) => { // lista os nomes dos arquivos da pasta
            for (let prop in path) {
                // chama a function Stat para cada arquivo 
                // de forma asincrona 
                stat((dir + '/' + path[prop]))
            }
        })

    } catch (e) {
        logErr(e)
        return
    }
}


controller.redireciona = async () => { // controler que fara uma bela bagunça 
    //    console.log('33')
    anoProcessadoF('../destino/') // apaga arquivos
    setTimeout(() => {

        readdir('../Arquivos') // faz a varedura e copia dos arquivos
    }, 10000);





}

module.exports = controller