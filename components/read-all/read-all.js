const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
const {conexao, personagens, db} = require("../conexao");

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
