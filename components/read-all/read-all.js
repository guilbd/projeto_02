const express = require("express");
const router = express.Router();

//Middleware - especifica que é esse o import do router no index que queremos utilizar
router.use(function timelog(req, res, next) {
  next();
  console.log("Time: ", Date.now());
});

//[GET] GetAllPersonagens

router.get("/personagens", async (req, res) => {
  res.send(await getPersonagensValidas());
});

module.exports = router;