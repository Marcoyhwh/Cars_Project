import app from '../app.js';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../Util/auth.middleware.js';
import roleMiddleware from '../Util/role.middleware.js';

// ROTAS CRUD

const prisma = new PrismaClient();


// Buscar:  todos os carros || por marca || por carro específico
app.get('/Brand', async (req, res) => {

    let getCar = []

    const { carID } = req.query;

    if (req.query.carID) {
        getCar = await prisma.car.findFirst({
            where: {
                carID: Number(carID),
            },
            include: {
                model: true  // traz o VehicleModel junto, para confirmar o contexto
            },
        })
    } else if (req.query.brandID) {
        getCar = await prisma.brand.findMany({
            include: {
                models: {
                    include: {
                        cars: true
                    }
                }
            }
        })

    } else {
        getCar = await prisma.brand.findMany()
    }

    if (!getCar) {
        return res.status(404).json({ message: 'Car not found' });
    }


    return res.status(200).json(getCar);


})

// Adicionar uma nova Marca e seus respectivos carros. CREATE
app.post('/Brand', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {

// Ordem: authMiddleware roda primeiro (obetem req.user),
// só depois roleMiddleware consegue verificar req.user.role.

    // 1. Busca apenas a última marca ordenada pelo brandID, modelID e carID
    const lastBrand = await prisma.brand.findFirst({
        orderBy: {
            brandID: 'desc',
        },
    });


    const lastVehicle = await prisma.vehicleModel.findFirst({
        orderBy: {
            modelID: 'desc',
        },
    });


    const lastCar = await prisma.car.findFirst({
        orderBy: {
            carID: 'desc',
        },
    });


    // 2. Define o novo ID: se existir uma marca anterior, pega o ID dela + 1. Se for a primeira, começa em 1.
    const nextBrandId = lastBrand ? lastBrand.brandID + 1 : 1;
    const nextVehicleId = lastVehicle ? lastVehicle.modelID + 1 : 1;
    const nextCarId = lastCar ? lastCar.carID + 1 : 1;



    const newBrand = await prisma.brand.create({
        data: {
            brandID: nextBrandId,
            name: req.body.Brand,
        },
    })


    const newVehicle = await prisma.vehicleModel.create({
        data: {
            modelID: nextVehicleId,
            name: req.body.VehicleModel,
            brandId: newBrand.id,
        },
    })


    const newCar = await prisma.car.create({
        data: {
            carID: nextCarId,
            name: req.body.Car,
            modelId: newVehicle.id,
        },
    })

    res.status(201).json({ message: 'Brand added successfully' });

});

// Update parts
app.patch('/Brand', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {

    const { carID } = req.query;
    const { name } = req.body;


    // Busca o carro pelo carID numérico para obter o ObjectId
    const car = await prisma.car.findFirst({
        where: { carID: Number(carID) }
    });

    if (!car) {
        return res.status(404).json({ message: 'Car not found' });
    }

    // Agora atualiza usando o id (ObjectId), que o Prisma aceita no where
    const updatedCar = await prisma.car.update({
        where: { id: car.id },
        data: { name },
    });

    return res.status(200).json({ message: 'Nome atualizado com sucesso!' });

});


// Delete Blocks
app.delete('/Brand', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {

const { brandID, modelID, carID } = req.query;

    try {
        // Busca a brand pelo brandID numérico para pegar o ObjectId
        const brand = await prisma.brand.findFirst({
            where: { brandID: Number(brandID) }
        });

        const vehicleModel = await prisma.vehicleModel.findFirst({
            where: { modelID: Number(modelID) }
        });

        const car = await prisma.car.findFirst({
            where: { carID: Number(carID) }
        });

        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        if (!vehicleModel) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        await prisma.car.delete({
            where: { id: car.id }
        });

        await prisma.vehicleModel.delete({
            where: { id: vehicleModel.id }
        });

        await prisma.brand.delete({
            where: { id: brand.id }
        });

        return res.status(204).end();

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

});