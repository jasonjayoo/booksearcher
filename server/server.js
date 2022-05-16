const express = require("express");
const path = require("path");
const db = require("./config/connection");


const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth.js");
const { typeDefs, resolvers } = require('./schemas');

async function runApolloServer() {
  const app = express();
  const PORT = process.env.PORT || 3001;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  await server.start();
  server.applyMiddleware({ app });

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
}

runApolloServer();