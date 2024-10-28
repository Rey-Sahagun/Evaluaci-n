// setup.js
const mongoose = require('mongoose');
const User = require('../src/models/userModel');

beforeAll(async () => {
    // Conectarse a MongoDB y esperar a que esté conectado completamente
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    
    await new Promise((resolve, reject) => {
        mongoose.connection.once('open', resolve).on('error', reject);
    });
    
    // Limpiar la colección de usuarios al inicio de las pruebas
    await User.deleteMany({});
    console.log("Conectado a MongoDB para pruebas y usuarios eliminados.");
});

afterAll(async () => {
    await mongoose.connection.close();
    console.log("Conexión de MongoDB cerrada.");
});
