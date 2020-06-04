import { GraphQLServer } from "graphql-yoga";
import schema from "./schema";
import dotenv from "dotenv";
import path from "path";
import logger from "morgan";

dotenv.config({ path: path.resolve(".env") });

const PORT = process.env.PORT || "4000";

const server = new GraphQLServer({
  schema
});

server.express.use(logger("dev"));

server.start({ port: PORT }, () =>
  console.log(`🔥Listening on Server : http://loacalhost${PORT}🔥`)
);
