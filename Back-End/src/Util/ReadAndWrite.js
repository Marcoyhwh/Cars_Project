import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathCarsFile = path.resolve(__dirname, '..', 'DataBase', 'garage.json');

const readCarsFile = async () => {
    const readFile = await fs.readFile(pathCarsFile, 'utf-8');
    return JSON.parse(readFile);
};

const writeCarsFile = async (cars) => {
    await fs.writeFile(pathCarsFile, JSON.stringify(cars, null, 2));
};

export { readCarsFile, writeCarsFile };