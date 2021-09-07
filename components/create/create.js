const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const { conexao, personagens, db } = require("../conexao");

//Middleware - especifica que é esse o import do router no index que queremos utilizar
router.use(function timelog(req, res, next) {
  next();
  console.log("Time: ", Date.now());
});

//[POST] Adicona personagem
router.use("/", async (req, res) => {
  await conexao();
  const objeto = req.body;

  if (!objeto || !objeto.nome || !objeto.imagemUrl) {
    res.status(400).send({
      error:
        "Personagem inválido, certifique-se que tenha os campos nome e imagemUrl",
    });
    return;
  }

  const result = await personagens.insertOne(objeto);

  console.log(result);
  //Se ocorrer algum erro com o mongoDb esse if vai detectar
  if (result.acknowledged == false) {
    res.status(500).send({ error: "Ocorreu um erro" });
    return;
  }

  res.status(200).send(objeto);
});

module.exports = router;
