import { Neo4jGraphQL } from '@neo4j/graphql';
import * as fs from 'fs';
import * as path from 'path';
import { configuration } from './configuration';

const schemaGraphql = '../../schema.graphql';
if (!fs.existsSync(path.join(__dirname, schemaGraphql))) {
  throw new Error(`can't open schemaGraphql: ${schemaGraphql}`);
};
// load GraphQL type definitions from schema.graphql file
export const typeDefs = fs
  .readFileSync(path.join(__dirname, schemaGraphql))
  .toString('utf-8');

// custom Resolvers
const resolvers = {
  Order: {
    estimatedDelivery: (_obj, _args, _context, _info) => {
      const options = [1, 5, 10, 15, 30, 45];
      const estDate = new Date();
      estDate.setDate(
        estDate.getDate() + options[Math.floor(Math.random() * options.length)]
      );
      return estDate;
    }
  }
};

// create executable GraphQL schema from GraphQL type definitions,
// using @neo4j/graphql to autogenerate resolvers
export const neoSchema = new Neo4jGraphQL({
  typeDefs,
  config: {
    jwt: {
      secret: configuration().accessTokenJwtSecret,
    }
  },
  resolvers,
});
