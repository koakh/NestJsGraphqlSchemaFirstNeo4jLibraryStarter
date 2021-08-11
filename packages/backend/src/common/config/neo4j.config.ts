import { configuration } from './configuration';
import neo4j from 'neo4j-driver';

// create Neo4j driver instance
export const neo4jDriver = neo4j.driver(
  configuration().neo4JUri,
  neo4j.auth.basic(
    configuration().neo4JUser,
    configuration().neo4JPassword
  )
);
