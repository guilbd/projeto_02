const express = require("express");
const mongodb = require("mongodb");
require("dotenv").config();
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbChar = process.env.DB_CHAR;
const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.${dbChar}.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const options = {
  useUnifiedTopology: true,
};
const client = new mongodb.MongoClient(connectionString, options)
const db = client.db("blue_db");
const personagens = db.collection("personagens");

async function conexao() {
  try{
    await client.connect()
    console.log("Connected to MongoDB")
  }
  catch(err){
    console.log(err)
  }  
};

module.exports = { conexao,db, personagens};
