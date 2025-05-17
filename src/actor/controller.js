import { ObjectId } from 'mongodb';
import { client } from '../common/db.js';

const actorCollection = client.db("cine-db").collection("actores");
const peliculaCollection = client.db("cine-db").collection("peliculas");

export const handleInsertActorRequest = async (req, res) => {
    try {
        const nombrePelicula = req.body.nombrePelicula;
        const pelicula = await peliculaCollection.findOne({ nombre: nombrePelicula });

        if (!pelicula) {
            return res.status(404).json({ message: "La película especificada no existe" });
        }

        const nuevoActor = {
            idPelicula: pelicula._id.toString(),
            nombre: req.body.nombre,
            edad: req.body.edad,
            estaRetirado: req.body.estaRetirado,
            premios: req.body.premios || []
        };

        const result = await actorCollection.insertOne(nuevoActor);

        if (result.acknowledged) {
            res.status(201).json({
                message: "Actor creado correctamente",
                id: result.insertedId
            });
        } else {
            res.status(500).json({ message: "Error al crear el actor" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al procesar la solicitud", error: error.message });
    }
};

export const handleGetActoresRequest = async (req, res) => {
    try {
        const actores = await actorCollection.find({}).toArray();
        res.status(200).json(actores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los actores", error: error.message });
    }
};

export const handleGetActorByIdRequest = async (req, res) => {
    try {
        const id = req.params.id;
        let objectId;

        try {
            objectId = new ObjectId(id);
        } catch (error) {
            return res.status(400).json({ message: "ID mal formado" });
        }

        const actor = await actorCollection.findOne({ _id: objectId });

        if (actor) {
            res.status(200).json(actor);
        } else {
            res.status(404).json({ message: "Actor no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el actor", error: error.message });
    }
};

export const handleGetActoresByPeliculaIdRequest = async (req, res) => {
    try {
        const idPelicula = req.params.pelicula;

        let objectIdPelicula;
        try {
            objectIdPelicula = new ObjectId(idPelicula);
        } catch (error) {
            return res.status(400).json({ message: "ID de película mal formado" });
        }

        const pelicula = await peliculaCollection.findOne({ _id: objectIdPelicula });

        if (!pelicula) {
            return res.status(404).json({ message: "Película no encontrada" });
        }

        const actores = await actorCollection.find({ idPelicula: idPelicula }).toArray();

        res.status(200).json(actores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los actores de la película", error: error.message });
    }
};