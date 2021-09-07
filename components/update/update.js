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

//[PUT] Atualizar personagem
router.put("/:id", async (req, res) => {
  await conexao();
  const id = req.params.id;
  console.log(id);
  const objeto = req.body;

  if (!objeto || !objeto.nome || !objeto.imagemUrl) {
    res.status(400);
    send({
      error:
        "Requisição inválida, certifique-se que tenha os campos nome e imagemUrl",
    });
    return;
  }

  const quantidadePersonagens = await personagens.countDocuments({
    _id: ObjectId(id),
  });

  if (quantidadePersonagens !== 1) {
    res.status(404).send({ error: "Personagem não encontrado" });
    return;
  }

  const result = await personagens.updateOne(
    {
      _id: ObjectId(id),
    },
    {
      $set: objeto,
    }
  );
  //console.log(result);
  //Se acontecer algum erro no MongoDb, cai na seguinte valiadação
  if (result.acknowledged == "undefined") {
    res
      .status(500)
      .send({ error: "Ocorreu um erro ao atualizar o personagem" });
    return;
  }
  const personagem = await personagens.findOne({ _id: ObjectId(id) });
  res.send(personagem);
});

module.exports = router;
