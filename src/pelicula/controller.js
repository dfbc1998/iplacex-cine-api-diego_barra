import { ObjectId } from 'mongodb';
import { client } from '../common/db.js';
import Pelicula from './pelicula.js';

const peliculaCollection = client.db("cine-db").collection("peliculas");

export const handleInsertPeliculaRequest = async (req, res) => {
    try {
        const nuevaPelicula = {
            nombre: req.body.nombre,
            generos: req.body.generos,
            anioEstreno: req.body.anioEstreno
        };

        const result = await peliculaCollection.insertOne(nuevaPelicula);

        if (result.acknowledged) {
            res.status(201).json({
                message: "Película creada correctamente",
                id: result.insertedId
            });
        } else {
            res.status(500).json({ message: "Error al crear la película" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al procesar la solicitud", error: error.message });
    }
};

export const handleGetPeliculasRequest = async (req, res) => {
    try {
        const peliculas = await peliculaCollection.find({}).toArray();
        res.status(200).json(peliculas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las películas", error: error.message });
    }
};

export const handleGetPeliculaByIdRequest = async (req, res) => {
    try {
        const id = req.params.id;
        let objectId;

        try {
            objectId = new ObjectId(id);
        } catch (error) {
            return res.status(400).json({ message: "ID mal formado" });
        }

        const pelicula = await peliculaCollection.findOne({ _id: objectId });

        if (pelicula) {
            res.status(200).json(pelicula);
        } else {
            res.status(404).json({ message: "Película no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la película", error: error.message });
    }
};

export const handleUpdatePeliculaByIdRequest = async (req, res) => {
    try {
        const id = req.params.id;
        let objectId;

        try {
            objectId = new ObjectId(id);
        } catch (error) {
            return res.status(400).json({ message: "ID mal formado" });
        }

        const actualizacion = {
            $set: {
                nombre: req.body.nombre,
                generos: req.body.generos,
                anioEstreno: req.body.anioEstreno
            }
        };

        const result = await peliculaCollection.updateOne({ _id: objectId }, actualizacion);

        if (result.matchedCount > 0) {
            res.status(200).json({ message: "Película actualizada correctamente" });
        } else {
            res.status(404).json({ message: "Película no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la película", error: error.message });
    }
};

export const handleDeletePeliculaByIdRequest = async (req, res) => {
    try {
        const id = req.params.id;
        let objectId;

        try {
            objectId = new ObjectId(id);
        } catch (error) {
            return res.status(400).json({ message: "ID mal formado" });
        }

        const result = await peliculaCollection.deleteOne({ _id: objectId });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Película eliminada correctamente" });
        } else {
            res.status(404).json({ message: "Película no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la película", error: error.message });
    }
};