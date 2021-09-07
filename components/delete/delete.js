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

//[DELETE] Deleta um personagem
router.delete("/:id", async (req, res) => {
  await conexao();
  const id = req.params.id;
  //Retorna a quantidade de personagens com o filtro(Id) especificado
  const quantidadePersonagens = await personagens.countDocuments({
    _id: ObjectId(id),
  });
  //Checar se existe o personagem solicitado
  if (quantidadePersonagens !== 1) {
    res.status(404).send({ error: "Personagem não encontrao" });
    return;
  }
  //Deletar personagem
  const result = await personagens.deleteOne({
    _id: ObjectId(id),
  });
  //Se não consegue deletar, erro do Mongo
  if (result.deletedCount !== 1) {
    res.status(500).send({ error: "Ocorreu um erro ao remover o personagem" });
    return;
  }

  res.send(204);
});

module.exports = router;
