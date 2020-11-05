let controller = {}

const fs = require('fs')



controller.ultimoDia = async (req, res) => {
    await fs.readFile('./ultimoDia.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).send('pedro')
        } else {
            let a = JSON.parse(data)
            res.status(200).send(a.data)
        }
    })
}


const deleteDest = async (dir) => { // deleta 
    try {

        fs.readdir(dir, (err, path) => { // lista todos os nome dos arquivos
            for (let prop in path) { // passa dentro da lista arquivo por arquivo
                fs.unlink(dir + path[prop], (err) => { // deleta arquivo por arquivo
                    if (err) console.log(err) // caso algo de errado
                })
            }
        })
    } catch (e) {
        logErr(e)
        return
    }
}

const anoProcessadoF = () => { // faz o processamento do ano atual
    fs.readFile('./ultimoDia.json', 'utf8', (err, data) => { // faz a leitura do json
        if (err) { // caso algo da errado
            console.log(err)
        } else { // caso de certo
            let json = JSON.parse(data) // converta o data Json para JSON 
            let anoProcessado = json.data // acha a data atual
            anoProcessado = (new Date(anoProcessado)).getFullYear() // separa o ano processado
            //console.log(anoProcessado)
            let dataAtual = new Date() // data atual
            let anoAtual = dataAtual.getFullYear() // só o ano atual 
            if (anoProcessado != anoAtual) { // se anos diferirem
                json.data = dataAtual // troca a data atual do json 
                json = JSON.stringify(json) // converte em json a data atual
                fs.writeFile('./ultimoDia.json', json, 'utf8', (err) => { //  sobreescreve arquivo json
                    if (err) { // caso algo de errado
                        logErr(err) // chama o log erro
                        return
                    } else { // deu certo?
                        deleteDest('../destino/') // chama a function que deleta 
                    }
                })
            } // else {} caso  o ano seja igual não fazer nada
        }
    })
}

anoProcessadoF()

const logErr = (e) => {
    console.log(e)
    return
}

const random = () => Math.floor(Math.random() * 10 + 1)

const copia = async (dir) => { // copia o arquivo
    try {

        let destino = '../destino'
        // isso aqui tem de vir do usuario


        let ext = dir.split('.').pop() // separa a extenção
        let nomeArq = dir.split('/').pop() // separa somente o nome do arquivo
        let nomeDestino = (nomeArq.split('.')) + (Date.now() * random()) // cria um nome do arquivo
      //  console.log(dir)
        fs.copyFile(dir, `${destino}/${nomeDestino}.${ext}`, "utf8", (err) => {
            if (err) {
                logErr(err)
            }
        })

    } catch (e) {
        logErr(e)
        return
    }
}

const mesIndexOf = (ano, dir) => {
    if((dir.indexOf(`/${ano}/`)) != '-1' || dir.indexOf(`/${ano-1}/12/`) != '-1'){
        return true
    }
}

const filtros = async (dir) => {
    let ano = (new Date()).getFullYear() 
    if(dir.indexOf('/Folha') != '-1' || dir.indexOf('/FOLHA')){
        if(mesIndexOf(ano, dir) === true) {
            copia(dir)
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

let cont = 0
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
    deleteDest('../destino/on')
    setTimeout(() => {

        readdir('../Arquivos') // faz a varedura e copia dos arquivos
    }, 1000);





}

module.exports = controller