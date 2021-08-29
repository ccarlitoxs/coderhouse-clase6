const fs = require('fs');

class chatController {
    //Listado de productos
    async listMessaje (req, res) {
        try{
            res.status(200).render('chatbox');
        }
        catch{
            res.status(400).send('No se pudieron mostrar los productos');
        }
    }

    //Agregar un producto nuevo 
    async addItems (req, res) {
        try{
            const data = await fs.promises.readFile('./tareaCoderHouse/db/chat.json', 'utf-8');
            let dataJson = JSON.parse(data);

            let producto = {
                    id:dataJson.length + 1,
                    name: req.body.name,
                    price: req.body.price,
                    url: req.body.url
            }
            dataJson.push({product: producto});    
            
            let productJson = JSON.stringify(dataJson, null, 2)
            await fs.promises.writeFile(`./tareaCoderHouse/db/chat.json`,productJson);
            res.status(200).redirect('/users');
        } 
        catch {
            res.status(400).send('No se pudo guardar tu prodcuto');
        }
    }
}

module.exports = chatController