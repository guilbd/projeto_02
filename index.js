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

    //mongodb.MongoClient.connect é a conexão do BD em si
    const client = await mongodb.MongoClient.connect(connectionString, options);

    //variável para simplificar a identificação do BD que está sendo trabalhado
    const db = client.db('blue_db');

    const personagens = db.collection('personagens');

    // .find({}) para criar um array
    const getPersonagensValidas = () => personagens.find({}).toArray();

    // ObjectId facilita eliminando o indexOf
    const getPersonagemById = async(id) => personagens.findOne({_id: ObjectId(id)});

    //cors
    app.all("/*", (req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");

        // "*" - libera todos os métodos, get, post... se fosse colocado "GET" só autorizaria o GET
		res.header("Access-Control-Allow-Methods", "*");

		res.header(
			"Access-Control-Allow-Headers",
			"Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
		);

		next();
	});
    
    //rota primária do backend
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

    //[POST] -incluindo um personagem
    app.post('/personagens', async (req, res) => {
        const objeto = req.body;

        if (!objeto || !objeto.nome || !objeto.imagemURL){
            res.send("Requisição inválida, certifique-se que tenha os campos nome e imagemURL.")
            return;
        }
        const insertedCount = await personagens.insertOne(objeto);
        
        if(!insertedCount){
            res.send("Ocorreu um erro");
            return;
        } else {
            res.send(objeto);
        }
    });
        
    //[PUT] - atualizar personagem
    app.put('/personagens/:id', async (req, res) => {
        const id = req.params.id;
        const objeto = req.body;
        res.send(await personagens.updateOne(
            {
                _id: ObjectId(id), //procura o id solicitado na requisição
            },
            {
                $set: objeto, // após o id localizado ele seta o objeto
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