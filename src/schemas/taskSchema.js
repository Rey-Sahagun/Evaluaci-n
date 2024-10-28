const { gql } = require('apollo-server');

const typeDefs = gql`
    type Task {
        _id: ID!
        title: String!
        completed: Boolean!
    }

    type Query {
        tasks: [Task]!
    }

    type Mutation {
        createTask(title: String!): Task!
        updateTask(_id: ID!, completed: Boolean!): Task!
        deleteTask(_id: ID!): Task!
    }

`;

module.exports = typeDefs;
    