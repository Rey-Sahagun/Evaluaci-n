const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json'); // Ruta al archivo de credenciales

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://serviciosweb-1590d.firebaseio.com"
});

module.exports = admin; 