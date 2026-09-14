import app from './app.js'; // tem funções no arquivo, por isso usa app from
import './Routes/brand.routes.js'; // aqui o arquivo importado nao contém funções a serem executadas apenas rotas, então vc só importa aqui e lá vc n precisa exportar
import './Routes/users.routes.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
