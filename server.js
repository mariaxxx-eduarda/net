const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();


server.use(middlewares);
server.use(router);


// O Render usa process.env.PORT automaticamente
const porta = process.env.PORT || 3000;


server.listen(porta, '0.0.0.0', () => {
    console.log(`JSON SERVER rodando na porta ${porta}`);
});
