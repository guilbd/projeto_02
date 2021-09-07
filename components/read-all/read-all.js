const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
const {conexao, personagens, db} = require("../conexao");

  // const dbUser = process.env.DB_USER;
  // const dbPassword = process.env.DB_PASSWORD;
  // const dbName = process.env.DB_NAME;
  // const dbChar = process.env.DB_CHAR;
  // const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.${dbChar}.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  // const options = {
  //   useUnifiedTopology: true,
  // };
  // const client = await mongodb.MongoClient.connect(connectionString, options);

  // const db = client.db("blue_db");
  // const personagens = db.collection("personagens");

  

  //Middleware - especifica que é esse o import do router no index que queremos utilizar
  router.use(function timelog(req, res, next) {
    next();
    console.log("Time: ", Date.now());
  });


//[GET] GetAllPersonagens

router.get("/", async (req, res) => {
  
  await conexao();
  const getPersonagensValidas = await personagens.find({}).toArray();
  res.send(getPersonagensValidas);
});

  

module.exports = router;
