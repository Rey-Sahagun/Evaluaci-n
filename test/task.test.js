require('dotenv').config();
const request = require('supertest');
const app = require('../src/index');
const { token, unauthorizedToken } = require('./auth.test');

let taskId;

describe('Pruebas CRUD de Tareas', () => {
    test('Crear una nueva tarea', async () => {
        const response = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Nueva tarea' });
        console.log('Crear tarea:', response.body); // Log para diagnosticar respuesta
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
        taskId = response.body._id;
    });

    test('Obtener todas las tareas del usuario', async () => {
        const response = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${token}`);
        console.log('Obtener tareas:', response.body); // Log para diagnosticar respuesta
        expect(response.statusCode).toBe(200);
        expect(response.body.mongoTasks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ _id: taskId, title: 'Nueva tarea' })
            ])
        );
    });

    test('Actualizar la tarea creada', async () => {
        const response = await request(app)
            .put(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ completed: true });
        console.log('Actualizar tarea:', response.body); // Log para diagnosticar respuesta
        expect(response.statusCode).toBe(200);
        expect(response.body.completed).toBe(true);
    });

    test('Eliminar la tarea creada', async () => {
        const response = await request(app)
            .delete(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);
        console.log('Eliminar tarea:', response.body); // Log para diagnosticar respuesta
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Tarea eliminada");
    });

    test('Fallido - Ver tarea de otro usuario', async () => {
        const response = await request(app)
            .get(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${unauthorizedToken}`);
        console.log('Ver tarea de otro usuario:', response.body); // Log para diagnosticar respuesta
        expect(response.statusCode).toBe(403);
        expect(response.body.error).toBe("Acceso denegado");
    });

    test('Fallido - Modificar tarea de otro usuario', async () => {
        const response = await request(app)
            .put(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${unauthorizedToken}`)
            .send({ completed: false });
        console.log('Modificar tarea de otro usuario:', response.body); // Log para diagnosticar respuesta
        expect(response.statusCode).toBe(403);
        expect(response.body.error).toBe("Acceso denegado");
    });

    test('Fallido - Eliminar tarea de otro usuario', async () => {
        const response = await request(app)
            .delete(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${unauthorizedToken}`);
        console.log('Eliminar tarea de otro usuario:', response.body); // Log para diagnosticar respuesta
        expect(response.statusCode).toBe(403);
        expect(response.body.error).toBe("Acceso denegado");
    });
});
