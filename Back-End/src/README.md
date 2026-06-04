1. Para iniciar o projeto no backend rode no terminal ( dentro da pasta do backend ):
npm run dev

2. Exemplo de como deve ser a estrutura de uma requisição do tipo POST por parte de um cliente para adicionar uma nova marca:
```json
{
  "brand": "Toyota",
  "models": [
    {
      "id": 1,
      "model": "Sedãs",
      "cars": [
        {
          "id": 1,
          "name": "Corolla"
        },
        {
          "id": 2,
          "name": "Camry"
        }
      ]
    },
    {
      "id": 2,
      "model": "Hatch",
      "cars": [
        {
          "id": 3,
          "name": "Yaris"
        }
      ]
    }
  ]
}
```
