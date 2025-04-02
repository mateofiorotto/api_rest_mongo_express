const express = require('express');
const router = express.Router();
const Videogame = require('../models/videogame.model');

//middleware para poder tomar un solo libro y despues usarlo en otras llamadas
const getVideogame = async(req,res,next) => {
    let videogame;
    const { id } = req.params;

    //expresion regular de mongo que chequea que el id sea valido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'El id del videojuego no es valido' });
    }

    try {
        videogame = await Videogame.findById(id);
        
        if (!videogame) {
            return res.status(404).json({ message: 'No se encontro el videojuego' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.videogame = videogame;
    next();
}

// Obtener los videojuegos en el index
router.get('/', async (req, res) => {
    try  {
        //traer todos los videojuegos
        const videogames = await Videogame.find();
        console.log(videogames);

        if(videogames.length === 0) {
            return res.status(204).json({ message: 'No se encontraron videojuegos' });
        }

        //esto retorna 200
        res.json(videogames);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
});

// Crear nuevo libro ( POST )
router.post('/', async (req, res) => {
        const { name, description, price, genre, platform } = req?.body;

        if (!name || !description || !price || !genre || !platform) {
            //devolver bad request
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const videogame = new Videogame(
            { 
                name, 
                description, 
                price, 
                genre, 
                platform 
            }
        );

    try {
        const newVideogame = await videogame.save();
        console.log(newVideogame);
        res.status(201).json(newVideogame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// Obtener videojuego por id
router.get('/:id', getVideogame, async (req, res) => {
    res.json(res.videogame);
});

// Actualizar videojuego (editar con PUT -- Esto edita todo)
router.put('/:id', getVideogame, async (req, res) => {
    try {
        const videogame = res.videogame;

        videogame.name = req.body.name || videogame.name;
        videogame.description = req.body.description || videogame.description;
        videogame.price = req.body.price || videogame.price;
        videogame.genre = req.body.genre || videogame.genre;
        videogame.platform = req.body.platform || videogame.platform;

        const updatedVideogame = await videogame.save();

        res.json(updatedVideogame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// con patch, para actualizar algun campo concreto
router.patch('/:id', getVideogame, async (req, res) => {
    try {

        if (!req.body.name && !req.body.description && !req.body.price && !req.body.genre && !req.body.platform) {
            return res.status(400).json({ message: 'Al menos un campo debe ser actualizado' });
        }

        const videogame = res.videogame;

        videogame.name = req.body.name || videogame.name;
        videogame.description = req.body.description || videogame.description;
        videogame.price = req.body.price || videogame.price;
        videogame.genre = req.body.genre || videogame.genre;
        videogame.platform = req.body.platform || videogame.platform;

        const updatedVideogame = await videogame.save();

        res.json(updatedVideogame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// delete
router.delete('/:id', getVideogame, async (req, res) => {
    try {
        const videogame = res.videogame;
        await videogame.deleteOne({
            _id: videogame._id
        });

        res.json({ message: 'Videojuego eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;