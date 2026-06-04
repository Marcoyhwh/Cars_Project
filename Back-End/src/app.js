import express from 'express';
import cors from 'cors';
const { readCarsFile, writeCarsFile } = await import('./utils.js');

const app = express();

app.use(cors());

// Criando um middleware para receber JSON
app.use(express.json());

// A partir daqui, serão escritas as rotas CRUD

// Buscar todos os carros
app.get('/cars', (req, res) => {
    const cars = readCarsFile();
    res.status(200).json(cars);
});

// Buscar por marca
app.get('/cars/:id', (req, res) => {
    const cars = readCarsFile();
    // A linha abaixo define que o ID será o ID que foi declarado pelo cliente na requisição
    const { id } = req.params;
    // Para ajudar a entender a linha abaixo, tente ler ela ao contrário
    const brand = cars.find((brand) => brand.id === id);
    res.status(200).json(brand);
})

// Adicionar um a nova Marca e seus respectivos carros.
app.post('/cars', (req, res) => {
    const { brand, models } = req.body;
    const carsFile = readCarsFile();
    
    const newId = carsFile.brand.at(-1).id + 1;
    
    carsFile.brand.push({ id: newId, brand, models})

    await writeCarsFile(carsFile); 

    res.status(201).json({ message: 'Brand added successfully' });
})



export default app;