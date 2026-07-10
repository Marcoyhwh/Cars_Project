import express from 'express';

const users = express();

users.use(express.json());

users.get('/user', async (req, res) => {
    
})


users.post('/user', async (req, res) => {
    
})


users.patch('/user', async (req, res) => {
    
})


users.delete('/user', async (req, res) => {
    
})


export default users;
