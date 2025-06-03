import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Client } = pkg;
const app = express();

const PORT = process.env.PORT || 3000;

// Cors configuration all origens
const corsOption = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-type'
};

// middleware usa cors con las opciones definidas
app.use(cors(corsOption));
// permite analizar el cuerpo de las peticiones json
app.use(express.json());
//Connect a la base de datos PostgreSQL
const client = new Client(
    {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
    }
);
// Conectar al cliente de PostgreSQL y verificar la conexión
client.connect((err) => {
    if (err) {
        console.error('Error al conectar a postres: ', err);
        process.exit(1);
    } else {
        console.log(('Si hay postres OwO'));
        }
});

// Ruta básica
// app.get('/', (req, res) => {
//   res.json({ mensaje: '¡Hola aqui el Murci!' });
// });

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// todo // obtener productos
app.get('/prueba', (req, res) => {
    client.query('SELECT * FROM api', (err, result) => {
        if (err) {
        res.status(500).json({ message: 'Error al obtener las pruebas', error: err.message });
      } else {
        res.json(result.rows);
      }
    }); 
});

// todo // agregar un prueba
app.post('/prueba', (req, res) => {
    const { nombre, cantidad } = req.body;
    client.query('INSERT INTO Api (nombre, cantidad) VALUES ($1, $2)', 
                [nombre, cantidad],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    details: err.message
                });
            } else {
                return res.json({ message: 'Producto agregado correctamente' });
            }
        }
    );
});

//todo // actalizar prueba
app.put('/prueba/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, cantidad } = req.body;
    client.query('UPDATE Api SET nombre = $1, cantidad = $2 WHERE id = $3', 
                [nombre, cantidad, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    details: err.message
                });
            } else {
                return res.json({ message: 'Producto actualizado correctamente' });
            }
        }
    );
});

// todo // eliminar prueba
app.delete('/prueba/:id', (req, res) => {
    const { id } = req.params;
    client.query('DELETE FROM Api WHERE id = $1', [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                details: err.message
            });
        } else {
            return res.json({ message: 'Producto eliminado correctamente' });
        }
    });
}
);

//todo // buscar prueba por id
app.get('/prueba/:id', (req, res) => {
    const { id } = req.params;
    client.query('SELECT * FROM Api WHERE id = $1', [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                details: err.message
            });
        } else if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            return res.json(result.rows[0]);
        }
    });
});


app.put('/prueba/:id', (req, res) => {});