import express from 'express';
import cors from 'cors';
import { connect } from './src/common/db.js';
import peliculaRoutes from './src/pelicula/routes.js';
import actorRoutes from './src/actor/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
    res.status(200).send("Bienvenido al cine Iplacex");
});

app.use('/api', peliculaRoutes);
app.use('/api', actorRoutes);

const startServer = async () => {
    try {
        await connect();
        app.listen(PORT, () => {
            console.log(`Servidor Express escuchando en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor:", error);
        process.exit(1);
    }
};

startServer();