import { configuration } from './configuration';
import neo4j from 'neo4j-driver';

let neo4jDriverInstance;

export const neo4jDriver = () => {
  if (neo4jDriverInstance) {
    // return Neo4j driver instance
    return neo4jDriverInstance;
  } else {
    // return a new Neo4j driver instance
    neo4jDriverInstance = neo4j.driver(
      configuration().neo4JUri,
      neo4j.auth.basic(
        configuration().neo4JUser,
        configuration().neo4JPassword
      )
    );
    return neo4jDriverInstance;
  }
};
