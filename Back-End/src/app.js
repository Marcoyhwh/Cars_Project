const express = require('express');
const cors = require('cors');
const { readCarsFile, writeCarsFile } = require('./Util/ReadAndWrite');

const app = express();

app.use(cors());

// Criando um middleware para receber JSON
app.use(express.json());

// A partir daqui, serão escritas as rotas CRUD

// Buscar todos os carros
app.get('/cars', async (req, res) => {
    const cars = await readCarsFile();
    res.status(200).json(cars);
});

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

// Adicionar um a nova Marca e seus respectivos carros.
app.post('/cars', async (req, res) => {
    const { brand, models } = req.body;
    const carsFile = await readCarsFile()

    // Definindo os IDs de forma automática
    const newBrandId = carsFile.at(-1).id + 1;
    const newModelId = carsFile.at(-1).models.at(-1).id + 1;
    const newCarsId = carsFile.at(-1).models.at(-1).cars.at(-1).id + 1;

    carsFile.push({ id: newBrandId, brand, models });

    await writeCarsFile(carsFile); 

    res.status(201).json({ message: 'Brand added successfully' });
});

module.exports = app;
