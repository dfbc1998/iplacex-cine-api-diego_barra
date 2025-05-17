import { ObjectId } from 'mongodb';

const Pelicula = {
    _id: ObjectId,
    nombre: String,
    generos: Array,
    anioEstreno: Number
};

export default Pelicula;