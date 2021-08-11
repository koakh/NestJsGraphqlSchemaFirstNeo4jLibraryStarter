export interface EnvironmentVariables {
  // app
  logger: string;
  // server: {
  httpsServerPort: number;
  httpsKeyFile: string;
  httpsCertFile: string;
  corsOriginEnabled: boolean;
  corsOriginReactFrontend: string;
  // neo4j
  neo4JUri: string;
  neo4JUser: string;
  neo4JPassword: string;
  // auth module
  accessTokenJwtSecret: string,
  accessTokenExpiresIn: string,
  refreshTokenJwtSecret: string,
  refreshTokenExpiresIn: string,
  refreshTokenSkipIncrementVersion: boolean,
}