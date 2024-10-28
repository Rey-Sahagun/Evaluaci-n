require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("Token no proporcionado en la solicitud.");
        return res.status(403).json({ error: 'Token no válido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("Token verificado correctamente:", decoded);
        next();
    } catch (error) {
        console.log("Error de verificación de token:", error.message);
        return res.status(403).json({ error: 'Token no válido' });
    }
};
