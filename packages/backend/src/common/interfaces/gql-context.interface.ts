import { Driver } from 'neo4j-driver';
import { GqlContextPayload } from './gql-context-payload.interface';

export interface GqlContext {
  req: Request;
  res: Response;
  payload?: GqlContextPayload;
  connection: any;
  driver: Driver;
}
