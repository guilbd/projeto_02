const express = require('express');
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

(async => {

    const app = express();

    app.use(express.json());

    const port = 3000;

    app.get('/', (req, res) => {
        res.send({ info: 'olá mundo'});
    });

    // app.get('/personagens', async (req, res) => {
    //     res.send()
    // })

    app.listen(port, () => {
        console.info(`App rodando em http://localhost:${port}`);

    })

})();