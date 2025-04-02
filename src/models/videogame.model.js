const mongoose = require('mongoose');
//luego de importar mongoose, creamos el esquema que ira a la BD
const videogameSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    genre: String,
    platform: String
})

//exportarlo como modelo de mongo
module.exports = mongoose.model('Videogame', videogameSchema);