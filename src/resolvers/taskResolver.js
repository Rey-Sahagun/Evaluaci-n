const taskService = require('../services/taskService');

const resolvers = {
    Query: {
        tasks: () => {
            return taskService.getAllTasks();
        }
    },
    Mutation: {
        createTask: (_, { title }) =>{
            return taskService.createTask(title);
        },
        updateTask: (_, { _id, completed }) => {
            return taskService.updateTask(_id, completed);  
        },
        deleteTask: (_, { _id }) => {
            return taskService.deleteTask(_id);
        }
    }
};

module.exports = resolvers;