import { EnvironmentVariables } from "../interfaces/environment-variables.interface";

export const configuration = (): EnvironmentVariables => ({
  // app
  logger: process.env.APP_LOGGER || 'error,warn',
  // server
  httpsServerPort: parseInt(process.env.HTTPS_HTTPS_SERVER_PORT, 10) || 3443,
  httpsKeyFile: process.env.HTTPS_KEY_FILE || 'config/privkey.pem',
  httpsCertFile: process.env.HTTPS_CERT_FILE || 'config/fullchain.pem',
  corsOriginEnabled: process.env.CORS_ORIGIN_ENABLED === 'true' ? true : false,
  corsOriginReactFrontend: process.env.CORS_ORIGIN_REACT_FRONTEND || 'https://localhost:3000',
  // neo4j
  neo4JUri: process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4JUser: process.env.NEO4J_USER || 'neo4j',
  neo4JPassword: process.env.NEO4J_PASSWORD || 'password',
  // auth module
  accessTokenJwtSecret: process.env.ACCESS_TOKEN_JWT_SECRET || 'rGtqzOjlW9OG47ncUKbPDltTxA3EtZFp',
  refreshTokenJwtSecret: process.env.REFRESH_TOKEN_JWT_SECRET || '3XgiizDr35A4H1I9ocOPTFeUkFSfKkSy',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  refreshTokenSkipIncrementVersion: (process.env.REFRESH_TOKEN_SKIP_INCREMENT_VERSION as unknown as boolean) || false,
});
