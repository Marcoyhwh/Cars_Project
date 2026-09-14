1. Para iniciar o projeto no backend rode no terminal ( dentro da pasta do backend ):
npm run dev

Rotas CRUD: http://localhost:3000/

2. Exemplo de como deve ser a estrutura de uma requisição do tipo POST por parte de um cliente realizar a requisição:

```
{
    "Brand": "Toyota",
    "VehicleModel": "Sedãs",
    "Car": "Corolla"
}
```

3. Exemplo de como deve ser a estrutura de uma requisição do tipo DELETE por parte de um cliente realizar a requisição:
http://localhost:3000/Brand?carID=1&modelID=1&brandID=1


4. Para não esquecer mais:
200 → sucesso
201 → criado
400 → erro do cliente
404 → não encontrado
500 → erro interno

5.  Depois que instalar uma biblioteca, é um bom hábito rodar no terminal npm audit para verificar vulnerabilidades e se houver:  npm audit fix - para conserta-lás.
OBS: Cuidado com o  npm audit fix --force pois ele pode atualizar certas dependências para corrigir vulnerabilidades porém pode quebrar seu projeto pois não é garantido a
compatibilidade com o que você usa no seu projeto