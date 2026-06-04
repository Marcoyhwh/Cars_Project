const fs = requite('fs').promises;
const path = require('path');

const pathCarsFile = path.resolve(__dirname, '..', 'DataBase', 'cars.json');

const ReadCarsFile = async () => {
    const readFile = await fs.readFile(pathCarsFile, 'utf-8');
    return JSON.parse(readFile);
}

const WriteCarsFile = async (cars) => {
    const writeFile = await fs.writeFile(pathCarsFile, JSON.stringify(cars));
    return writeFile;
}

module.exports = {
    ReadCarsFile,
    WriteCarsFile
}