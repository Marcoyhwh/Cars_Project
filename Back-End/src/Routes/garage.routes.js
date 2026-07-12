import app from '../app.js';
import { readCarsFile, writeCarsFile } from '../Util/ReadAndWrite.js';

// ROTAS CRUD


// Buscar todos os carros
app.get('/garage', async (req, res) => {
    const cars = await readCarsFile();
    res.status(200).json(cars);
});


// Buscar por marca
app.get('/garage/:brandID', async (req, res) => {
    const cars = await readCarsFile();
    // A linha abaixo define que o ID será o ID que foi declarado pelo cliente na requisição
    const { brandID } = req.params;
    // Para ajudar a entender a linha abaixo, tente ler ela ao contrário
    // o nome de brand.(ESTE NOME) deve ser o mesmo de === Number (ESTE NOME)
    const brand = cars.find((brand) => brand.brandID === Number(brandID));

    if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
    }

    return res.status(200).json(brand);
});


// Buscar carro específico
app.get('/garage/:brandID/models/:modelID/cars/:carID', async (req, res) => {
    const readFile = await readCarsFile();

    const { brandID, modelID, carID } = req.params;



    const brand = readFile.find((brand) => brand.brandID === Number(brandID));
    if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
    }

    const model = brand.models.find((model) => model.modelID === Number(modelID));
    if (!model) {
        return res.status(404).json({ message: 'Model not found' });
    }

    const car = model.cars.find((car) => car.carID === Number(carID));
    if (!car) {
        return res.status(404).json({ message: 'Car not found' });

    }

    return res.status(200).json(car);
});


// Adicionar um a nova Marca e seus respectivos carros. CREATE
app.post('/garage', async (req, res) => {
    const { brand, models } = req.body;
    const carsFile = await readCarsFile()

    if (!brand || !models || !Array.isArray(models)) {
        return res.status(400).json("Erro interno, verifique os dados enviados e tente novamente");
    }

    // Definindo estrutura para um novo objeto (marca) ser adicionado no arquivo JSON
    const newBrand = {
        brandID: carsFile.length + 1,
        brand,
        models: models.map((name, modelIndex) => ({
            modelID: modelIndex + 1,
            model: name.model,
            cars: name.cars.map((car, carIndex) => ({
                carID: carIndex + 1,
                name: car.name
            }))
        }))
    };

    carsFile.push(newBrand);

    await writeCarsFile(carsFile);

    res.status(201).json({ message: 'Brand added successfully' });
});


// Update parts
app.patch('/garage/:brandID/models/:modelID/cars/:carID', async (req, res) => {
    const readFile = await readCarsFile();

    const { brandID, modelID, carID } = req.params;
    const { name } = req.body;

    const brand = readFile.find((brand) => brand.brandID === Number(brandID));
    if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
    }

    const model = brand.models.find((model) => model.modelID === Number(modelID));
    if (!model) {
        return res.status(404).json({ message: 'Model not found' });
    }

    const car = model.cars.find((car) => car.carID === Number(carID));
    if (!car) {
        return res.status(404).json({ message: 'Car not found' });
    }

    if (typeof name !== 'string') {
        return res.status(400).json({ message: 'Invalid Name' });
    }

    car.name = name;

    await writeCarsFile(readFile);

    return res.status(200).json({ message: 'nome atualizado com sucesso!', car });

});


// Delete Blocks
app.delete('/garage', async () => {
    const [id] = req.params;

    const carFile = await readCarsFile();

    try {
        const result = carFile.remove(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'erro, verifique o ID digitado e tente denovo!' })
        }

        return res.status(204).end(); cars
    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: 'Internal Server Error! ' });
    }

});