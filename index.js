const express = require("express");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
require("dotenv").config();
require("express-async-errors");
//requires de endpoints
const home = require("./components/home/home");
const readAll = require("./components/read-all/read-all");
const readById = require("./components/read-by-id/read-by-id");
const del = require("./components/delete/delete");
const atualizar = require("./components/update/update");
const criar = require("./components/create/create");

(async () => {
	const dbUser = process.env.DB_USER;
	const dbPassword = process.env.DB_PASSWORD;
	const dbName = process.env.DB_NAME;
	const dbChar = process.env.DB_CHAR;

	const app = express();
	app.use(express.json());

	const port = process.env.PORT || 3000;
	const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.${dbChar}.mongodb.net/${dbName}?retryWrites=true&w=majority`;

	const options = {
		useUnifiedTopology: true,
	};

	console.info("Conectando ao MongoDB Atlas...");

	const client = await mongodb.MongoClient.connect(connectionString, options);

	console.info("Conexão estabelecida com o MongoDB Atlas!");

	const db = client.db("blue_db");
	const personagens = db.collection("personagens");

	const getPersonagensValidas = () => personagens.find({}).toArray();

	const getPersonagemById = async (id) =>
		personagens.findOne({ _id: ObjectId(id) });

	//CORS

	app.all("/*", (req, res, next) => {
		res.header(
			"Access-Control-Allow-Origin",
			"https://front-rick-morty-blue.herokuapp.com",
			"https://front-rick-morty-blue.herokuapp.com/add"
		);

		res.header("Access-Control-Allow-Methods", "*");

		res.header(
			"Access-Control-Allow-Headers",
			"Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
		);

		next();
	});

	//Criando a rota home
	app.use("/home", home);

	// criando a rota read-all
	app.use("/personagens/read-all", readAll);

	//[GET] getPersonagemById

	app.use("/personagens/read-by-id/", readById);

	//[POST] Adicona personagem
	app.use("/personagens/create/", criar);

	//[PUT] Atualizar personagem
	app.use("/personagens/update/", atualizar);

	//[DELETE] Deleta um personagem
	app.use("/personagens/delete/", del);

	//Tratamento de erros
	//Middleware verificar endpoints
	app.all("*", function (req, res) {
		res.status(404).send({ message: "Endpoint was not found" });
	});

	//Middleware -> Tratamento de erro
	app.use((error, req, res, next) => {
		res.status(error.status || 500).send({
			error: {
				status: error.status || 500,
				message: error.message || "Internal Server Error",
			},
		});
	});

	app.listen(port, () => {
		console.info(`App rodando em http://localhost:${port}/home`);
	});
})();
