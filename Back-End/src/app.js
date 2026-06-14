const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { readCarsFile, writeCarsFile } = require('./Util/ReadAndWrite');

// p/ o express, como é uma função, é necessário executá-la para criar a aplicação e só dps usar seus métodos necessários p/ a aplicação.
const app = express();

// já o helmet e o cors, tbm são uma função porém eles retornam um middleware, ou seja, vocẽ pode usar eles diretamente no app.use() sem a necessidade de executá-los, pois o próprio app.use() já executa um middleware.
app.use(helmet());
app.use(cors());

// Criando um middleware para receber JSON
app.use(express.json());


// A partir daqui, serão escritas as rotas CRUD

// Buscar todos os carros
app.get('/cars', async (req, res) => {
    const cars = await readCarsFile();
    res.status(200).json(cars);
});

// Read

// Buscar por marca
app.get('/cars/:id', async (req, res) => {
    const cars = await readCarsFile();
    // A linha abaixo define que o ID será o ID que foi declarado pelo cliente na requisição
    const { id } = req.params;
    // Para ajudar a entender a linha abaixo, tente ler ela ao contrário
    const brand = cars.find((brand) => brand.id === Number(id));

    if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
    }

    return res.status(200).json(brand);
});

// Create

// Adicionar um a nova Marca e seus respectivos carros.
app.post('/cars', async (req, res) => {
    const { brand, models } = req.body;
    const carsFile = await readCarsFile()

    if (!brand || !models || !Array.isArray(models)) {
        return res.status(400).json("Erro interno, verifique os dados enviados e tente novamente");
    }

    // Definindo estrutura para um novo objeto (marca) ser adicionado no arquivo JSON
    const newBrand = {
        id: carsFile.length + 1,
        brand,
        models: models.map((name, modelIndex) => ({
            id: modelIndex + 1,
            model: name.model,
            cars: name.cars.map((car, carIndex) => ({
                id: carIndex + 1,
                name: car.name
            }))
        }))
    };

    carsFile.push(newBrand);

    await writeCarsFile(carsFile); 

    res.status(201).json({ message: 'Brand added successfully' });
});

// Update

app.patch('/cars', async (req, res) => {
    const readCarsFile = await readCarsFile();
    const jsonCarFile = JSON.parse(readCarFile);

    const { id } = req.params;
    const { name } = req.body;

    const carIndex = jsonCarFile.findIndex(( car ) => car.id === number(id))

    if (id <= 0) {
        return res.status(404).json{('erro, verifique o id digitado e tente novamente!')}
    }

    const patchName = () => {
        if (typeof name === "string") { 
            carIndex[name].name 
        } else {
            console.log('o valor digitado não é uma string')
        }
    }
    readCarsFile.push(patchName)

    await writeCarsFile()

    return res.status(200).json{( 'nome atualizado com sucesso!' )}

});


module.exports = app;
