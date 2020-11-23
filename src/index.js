const { GraphQLServer } = require('graphql-yoga');
const session = require("express-session");
const { PrismaClient } = require('@prisma/client');
const { PubSub } = require('graphql-yoga');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');

const pubsub = new PubSub();
const prisma = new PrismaClient();

const resolvers = {
    Query, 
    Mutation,
};

const opts = {
  port: process.env.PORT,
  cors: {
    credentials: true,
    origin: ["https://find-me-lime.vercel.app"] // your frontend url.
  }
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
    opts
});

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


server.start(() => console.log('server running on port 4000'));