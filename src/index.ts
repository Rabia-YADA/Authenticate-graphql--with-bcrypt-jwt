import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import http from "http";
import { AppDataSource } from "./data-source";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { SignUpResolver } from "./resolvers/SignupResolver";


const PORT = 4000;
AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const schema = await buildSchema({
      resolvers: [UserResolver],
    })

    const server = new ApolloServer({
      schema: schema,
      context: ({ req, res }) => ({ req, res })
    });

    await server.start();
    const httpServer = http.createServer(app);
    server.applyMiddleware({ app, path: "/graphql" });
    httpServer.listen( {port: PORT}, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);

    });

  }).catch((error) => console.log(error));
