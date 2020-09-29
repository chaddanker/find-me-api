const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const { PubSub } = require('graphql-yoga');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Vote = require('./resolvers/Vote');

const pubsub = new PubSub();
const prisma = new PrismaClient();

const resolvers = {
    Query, 
    Mutation,
    Subscription,
    User, 
    Link,
    Vote,
};


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: request => {
        return {
            ...request,
            prisma,
            pubsub,
        };
    },
});

server.start(() => console.log('server running on port 4000'));