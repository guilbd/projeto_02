const express = require('express');
const mongodb = require('mongodb');
require("dotenv").config();

const ObjectId = mongodb.ObjectId;

(async () => {

    const dbHost = process.env.DB_HOST;

    const dbPort = process.env.DB_PORT;

    const dbName = process.env.DB_NAME;

    const app = express();

    app.use(express.json());

    //process.env.PORT utilizado quando for feito o deploy (nuvem).
    const port = process.env.PORT || 3000;

    const connectionString = `mongodb://${dbHost}:${dbPort}/${dbName}`;
    
    const options = {
        useUnifiedTopology: true,
    };

    const client = await mongodb.MongoClient.connect(connectionString, options);

    const db = client.db('blue_db');

    const personagens = db.collection('personagens');

    const getPersonagensValidas = () => personagens.find({}).toArray();

    const getPersonagemById = async(id) => personagens.findOne({_id: ObjectId(id)});
    
    app.get('/', (req, res) => {
        res.send({ info: 'olá mundo'});
    });

    // [GET] GetPersonagemById
    app.get('/personagens/:id', async (req, res) =>{
        const id = req.params.id;
        const personagem = await getPersonagemById(id);
        res.send(personagem);
    })

    // [GET] GetAllPersonagens
    app.get('/personagens', async (req, res) => {
        res.send(await getPersonagensValidas());
    });

    app.post('/personagens', async (req, res) => {
        const objeto = req.body;

        if (!objeto || !objeto.nome || !objeto.imagemURL){
            res.send("Objeto inválido")
            return;
        }
        const {insertedCount} = await personagens.insertOne(objeto);
        
        if(!insertedCount){
            res.send("Ocorreu um erro");
            return;
        } else {
            res.send(objeto);
        }
    });
        
    app.put('/personagens/:id', async (req, res) => {
        const id = req.params.id;
        const objeto = req.body;
        res.send(await personagens.updateOne(
            {
                _id: ObjectId(id),
            },
            {
                $set: objeto,
            }
        ));
    });
        
    app.delete('/personagens/:id', async (req, res) => {
        const id = req.params.id;
        
        res.send(await personagens.deleteOne(
            {
                _id: ObjectId(id),
            })
        );
    });    
    

    app.listen(port, () => {
        console.info(`App rodando em http://localhost:${port}`);

    });

})();