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

//[GET] GetPersonagensById

router.get("/:id", async (req, res) => {
  await conexao();
  const id = req.params.id;
  console.log(id);
  const personagem = await personagens.findOne({ _id: ObjectId(id) });
  if (!personagem) {
    res
      .status(404)
      .send({ error: "O personagem especificado não foi encontrado" });
    return;
  }
  res.send(personagem);
});

module.exports = router;
