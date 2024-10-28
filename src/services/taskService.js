const Task = require('../models/taskModel');
const firebaseAdmin = require('../config/firebase'); // Importa la instancia inicializada
const firestore = firebaseAdmin.firestore();

const taskService = {
    getAllTasks: async (userId) => {
        try {
            const mongoTasks = await Task.find({ userId });

            const firebaseTasksSnapshot = await firestore.collection('tasks').where('userId', '==', userId).get();
            const firebaseTasks = firebaseTasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            return { mongoTasks, firebaseTasks };
        } catch (error) {
            throw new Error('Error al obtener tareas');
        }
    },

    createTask: async (taskData) => {
        try {
            const task = new Task(taskData);
            const savedTask = await task.save();

            await firestore.collection('tasks').add({
                title: taskData.title,
                completed: taskData.completed || false,
                userId: taskData.userId
            });

            return savedTask;
        } catch (error) {
            throw new Error('Error al crear tarea');
        }
    },

    updateTask: async (taskId, userId, updateData) => {
        try {
            const updatedTask = await Task.findOneAndUpdate(
                { _id: taskId, userId },
                updateData,
                { new: true }
            );

            const firebaseTaskSnapshot = await firestore.collection('tasks').where('userId', '==', userId).get();
            firebaseTaskSnapshot.forEach(async (doc) => {
                if (doc.id === taskId) {
                    await doc.ref.update(updateData);
                }
            });

            return updatedTask;
        } catch (error) {
            throw new Error('Error al actualizar tarea');
        }
    },

    deleteTask: async (taskId, userId) => {
        try {
            const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });

            const firebaseTaskSnapshot = await firestore.collection('tasks').where('userId', '==', userId).get();
            firebaseTaskSnapshot.forEach(async (doc) => {
                if (doc.id === taskId) {
                    await doc.ref.delete();
                }
            });

            return deletedTask;
        } catch (error) {
            throw new Error('Error al eliminar tarea');
        }
    }
};

module.exports = taskService;
