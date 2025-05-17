import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://diego-barra:2wVgNm7yJLpbCz2G@eva-u3-express.u9zoedo.mongodb.net/?retryWrites=true&w=majority&appName=eva-u3-express";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function connect() {
    try {
        await client.connect();
        console.log("Conexión exitosa a MongoDB Atlas");
        return client.db("cine-db");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        throw error;
    }
}

export { connect, client };