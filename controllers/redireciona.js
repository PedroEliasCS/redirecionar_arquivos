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

let cont1 = 0
const copia = async (dir) => {
    try {
        let ext = dir.split('.').pop()
        let destino = '/teste/destino'
        let nomeArq = dir.split('/').pop()
        let nomeDestino = (Date.now() * dir.length) +  nomeArq
        await fs.copyFile(dir, `${destino}/${nomeDestino}.${ext}`, "utf8", (err) => {
            if (err) {
                console.log('erro na copia do arquivo : ', dir)
                console.log(err)
            } else {

                // console.log('ok : ' ,dir)
            }
        })
    } catch (e) {
        console.log(e, ' erro')
    }
}

const stat = async (dir) => {
    
    fs.stat(dir, (err, file) => {
        if (file.isDirectory() === true) {
            readdir(dir)

        } else if (file.isFile() === true) {
            cont1++
            console.log(cont1)
            copia(dir)
        }
    })
}

let cont = 0
const readdir = async (dir) => {
    await fs.readdir(dir, (err, path) => {
        for (let prop in path) {
            stat((dir + '/' + path[prop]))
        }
    })

}

const deleteDest = async (dir) => {
    fs.readdir(dir, (err, path) => {
        for(let prop in path){
            fs.unlink(dir + path[prop], (err) => {
                if(err) console.log(err)
            })
        }
    })
}

controller.redireciona = async () => {
    let a = await deleteDest('/teste/destino/')
    let b = await readdir('/teste/aSerem')

}

module.exports = controller