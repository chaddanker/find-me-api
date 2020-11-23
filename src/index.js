const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const { PubSub } = require('graphql-yoga');
const session = require("express-session");

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');

const pubsub = new PubSub();
const prisma = new PrismaClient();

const resolvers = {
    Query, 
    Mutation,
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

const opts = {
  cors: {
    credentials: true,
    origin: ["https://find-me-lime.vercel.app"] // your frontend url.
  }
};

const SESSION_SECRET = "lsdfjlkjlkewaqra";

server.express.use(
  session({
    name: "qid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  })
);


server.start(opts, () => console.log('server running on port 4000'));