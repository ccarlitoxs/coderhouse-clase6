const fs = require('fs');

class Contenedor {

    //contructor del objeto
    constructor(archivo) {
        this.archivo=archivo;
        this.id = 0;
        this.data =[];
    }

    //metodo para guardar el objeto dentro del archivo
    async save(objeto) {
        await this.getAll();
        this.id++;
        this.data.push({
            id:this.id,
            product: objeto
        })
        await fs.promises.writeFile(`./tareaCoderHouse/db/${this.archivo}`,JSON.stringify(this.data, null, 2));
        return this.id;
    }

    //metodo para cosultar por id
    async getById(id) {
        await this.getAll();
        return this.data.find((producto) => producto.id === id)
    }

    //metodo para devolver todo en el archivo 
    async getAll() {
        try {
            const data = await fs.promises.readFile(`./ServerCoderHouse/product/${this.archivo}`, 'utf-8')
            if (data) {
                this.data = JSON.parse(data);
                this.data.map((producto) => {
                    if (this.id < producto.id) {
                        this.id = producto.id
                    }
                })
                return this.data;
            }
        } catch (error) {
            return 
        }
    }
    
    //metodo random 
    async getRandomId(){
        await this.getAll();
        let numero = this.data.length;
        let numeroRandom = Math.round(Math.random() * (numero - 1) + 1);
        let respuesta = this.data.find((producto) => producto.id === numeroRandom)
        return respuesta
    }

    //metodo para borrar por id
    async deleteById(id) {
        await this.getAll();
        await fs.promises.unlink(`./ServerCoderHouse/product/${this.archivo}`);
        const data = this.data.filter((producto) => producto.id !== id);
        await fs.promises.writeFile(`./ServerCoderHouse/product/${this.archivo}`,JSON.stringify(data, null, 2));
    }

    // metodo para borrar todo 
    async deleteAll() {
        await fs.promises.unlink(`./ServerCoderHouse/product/${this.archivo}`);
        this.id = 0;
        this.data =[];
    }

}

module.exports = Contenedor

