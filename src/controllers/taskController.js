const taskService = require('../services/taskService');

const taskController = {
    getAllTasks: async (req, res) => {
        try {
            const tasks = await taskService.getAllTasks(req.userId);
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener tareas" });
        }
    },

    createTask: async (req, res) => {
        try {
            const taskData = { ...req.body, userId: req.userId };
            const task = await taskService.createTask(taskData);
            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ error: "Error al crear tarea" });
        }
    },

    updateTask: async (req, res) => {
        try {
            const task = await taskService.updateTask(req.params.id, req.userId, req.body);
            if (!task) return res.status(404).json({ error: "Tarea no encontrada" });
            res.json(task);
        } catch (error) {
            res.status(400).json({ error: "Error al actualizar tarea" });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const task = await taskService.deleteTask(req.params.id, req.userId);
            if (!task) return res.status(404).json({ error: "Tarea no encontrada" });
            res.json({ message: "Tarea eliminada" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar tarea" });
        }
    }
};

module.exports = taskController;
