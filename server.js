const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const listEndpoints = require('express-list-endpoints');

require('dotenv').config();

const app = express();

// Koneksi ke Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route untuk customers
app.use('/api/customers', customerRoutes);

// Route untuk Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route untuk menangani 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rute tak ditemukan',
    });
});

// Memulai server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server ini berjalan di port ${PORT}`);

    // Menampilkan semua route setelah server mulai
    const endpoints = listEndpoints(app);
    console.log('Available Routes:');
    endpoints.forEach(endpoint => {
        console.log(`${endpoint.method}: ${endpoint.path}`);
    });
});
