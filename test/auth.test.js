const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');

let token;
let unauthorizedToken;

describe('Pruebas de Autenticación', () => {
    let randomUsername;
    let unauthorizedUsername;

    beforeAll(() => {
        randomUsername = `user_${Math.random().toString(36).substring(2, 10)}`;
        unauthorizedUsername = `user_${Math.random().toString(36).substring(2, 10)}`;
        console.log("Generando usuario aleatorio:", randomUsername);
        console.log("Generando usuario no autorizado aleatorio:", unauthorizedUsername);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Registrar un nuevo usuario', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({ username: randomUsername, password: 'password123' });
        console.log('Registrar usuario:', response.body); // Log para diagnosticar respuesta
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Usuario registrado exitosamente");
        token = response.body.token; // Guarda el token para pruebas posteriores
    });

    test('Iniciar sesión con el usuario registrado', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: randomUsername, password: 'password123' });
        console.log('Iniciar sesión usuario registrado:', response.body); // Log para diagnosticar respuesta
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        token = response.body.token;
    });

    test('Registrar un segundo usuario no autorizado', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({ username: unauthorizedUsername, password: 'password123' });
        console.log('Registrar usuario no autorizado:', response.body); // Log para diagnosticar respuesta
        expect(response.statusCode).toBe(201);
        unauthorizedToken = response.body.token;
    });

    test('Iniciar sesión con el usuario no autorizado', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: unauthorizedUsername, password: 'password123' });
        console.log('Iniciar sesión usuario no autorizado:', response.body); // Log para diagnosticar respuesta
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        unauthorizedToken = response.body.token;
    });

    test('Fallido - Iniciar sesión con credenciales incorrectas', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: randomUsername, password: 'wrongpassword' });
        console.log('Inicio de sesión fallido:', response.body); // Log para diagnosticar respuesta
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Credenciales inválidas");
    });
});
