// Traemos express, moongose, bodyparser y dotenv
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { config } = require('dotenv');
config(); // ejecutamos el archivo .env

//traer rutas de videojuegos
const videogameRoutes = require('./routes/videogame.routes');

// Creamos el servidor. Usamos bodyparser para parsear el body recibido. Usamos express para los middlewares
const app = express();
app.use(bodyParser.json());

///conectar a la bd mongo
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection;

// pasamos la ruta y lo que importamos
app.use('/videogames', videogameRoutes);


// Creamos el puerto
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});
