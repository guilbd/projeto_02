const express = require("express");
const mongodb = require("mongodb");
require("dotenv").config();

const ObjectId = mongodb.ObjectId;

(async () => {
  const dbUser = process.env.DB_USER;

  const dbPassword = process.env.DB_PASSWORD;

  const dbName = process.env.DB_NAME;

  const dbChar = process.env.DB_CHAR;

  const app = express();

  app.use(express.json());

  //process.env.PORT utilizado quando for feito o deploy (nuvem).
  const port = process.env.PORT || 3000;

  const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.${dbChar}.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  // const connectionString = `mongodb://${dbHost}:${dbPort}/${dbName}`;

  const options = {
    useUnifiedTopology: true,
  };

  console.info("Conectando ao MongoDB Atlas...");

  //mongodb.MongoClient.connect é a conexão do BD em si
  const client = await mongodb.MongoClient.connect(connectionString, options);

  console.info("Conexão estabelecida com o MongoDB Atlas com sucesso!");

  //variável para simplificar a identificação do BD que está sendo trabalhado
  const db = client.db("blue_db");

  const personagens = db.collection("personagens");

  // .find({}) para criar um array
  const getPersonagensValidas = () => personagens.find({}).toArray();

  // ObjectId facilita eliminando o indexOf
  const getPersonagemById = async (id) =>
    personagens.findOne({ _id: ObjectId(id) });

  //CORS
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
  app.get("/", (req, res) => {
    res.send({ info: "olá mundo" });
  });

  // [GET] GetPersonagemById
  app.get("/personagens/:id", async (req, res) => {
    const id = req.params.id;
    const personagem = await getPersonagemById(id);
    if (!personagem) {
      res.status(404).send({ error: "Personagem especificado não foi encontrado."});
      return;
    };
    res.send(personagem);
  });

  // [GET] GetAllPersonagens
  app.get("/personagens", async (req, res) => {
    res.send(await getPersonagensValidas());
  });

  //[POST] -incluindo um personagem
  app.post("/personagens", async (req, res) => {
    const objeto = req.body;

    if (!objeto || !objeto.nome || !objeto.imagemUrl) {
      res.send(
        "Requisição inválida, certifique-se que tenha os campos nome e imagemURL."
      );
      return;
    };
    const result = await personagens.insertOne(objeto);

    //console.log(result);

    if (result.acknowledged == false) {
      res.send("Ocorreu um erro");
      return;
    }
    res.send(objeto);
  });

  //[PUT] - atualizar personagem
  app.put("/personagens/:id", async (req, res) => {
    const id = req.params.id;
    const objeto = req.body;

    if (!objeto || !objeto.nome || !objeto.imagemUrl) {
      res.send(
        "Requisição inválida, certifique-se que tenha os campos nome e imagemUrl"
      );
      return;
    }

    const quantidadePersonagens = await personagens.countDocuments({
      _id: ObjectId(id),
    });

    if (quantidadePersonagens !== 1) {
      res.send("Personagem não encontrado");
      return;
    }

    const result = await personagens.updateOne(
      {
        _id: ObjectId(id), //procura o id solicitado na requisição
      },
      {
        $set: objeto, // após o id localizado ele seta o objeto
      }
    );
    //console.log(result);
    //Se acontecer algum erro no MongoDb, cai na seguinte valiadação
    if (result.modifiedCount !== 1) {
      res.send("Ocorreu um erro ao atualizar o personagem");
      return;
    }
    res.send(await getPersonagemById(id));
  });

  //[DELETE] Deleta um personagem
  app.delete("/personagens/:id", async (req, res) => {
    const id = req.params.id;
    //Retorna a quantidade de personagens com o filtro(Id) especificado
    const quantidadePersonagens = await personagens.countDocuments({
      _id: ObjectId(id),
    });
    //Checar se existe o personagem solicitado
    if (quantidadePersonagens !== 1) {
      res.send("Personagem não encontrao");
      return;
    }
    //Deletar personagem
    const result = await personagens.deleteOne({
      _id: ObjectId(id),
    });
    //Se não con
    if (result.deletedCount !== 1) {
      res.send("Ocorreu um erro ao remover o personagem");
      return;
    }

    res.send("Personagem removido com sucesso!");
  });

  app.listen(port, () => {
    console.info(`App rodando em http://localhost:${port}`);
  });
})();
