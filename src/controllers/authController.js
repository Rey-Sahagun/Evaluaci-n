
require('dotenv').config();
const jwt = require('jsonwebtoken');
console.log(process.env.JWT_SECRET);
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verificación de existencia de usuario
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log("Intento de registro de usuario duplicado:", username);
            return res.status(400).json({ error: 'Nombre de usuario ya está en uso' });
        }

        // Encriptación de contraseña y creación de usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no está configurado');
        }

        // Generación de token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generado al registrar usuario:', token);

        res.status(201).json({ message: 'Usuario registrado exitosamente', token });
    } catch (error) {
        console.log("Error al registrar usuario:", error.message);
        res.status(400).json({ error: 'Error al registrar usuario' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        console.log("Usuario encontrado para login:", user);

        if (!user || !await bcrypt.compare(password, user.password)) {
            console.log("Credenciales inválidas para el usuario:", username);
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generación de token al iniciar sesión
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generado al iniciar sesión:', token);

        res.status(200).json({ token });
    } catch (error) {
        console.log("Error al iniciar sesión:", error.message);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};
