import { Injectable } from '@nestjs/common';
const { OGM } = require("@neo4j/graphql-ogm");
import { typeDefs, neo4jDriver as driver } from '../../config';

// const ogm = new OGM({ typeDefs, driver });
// const User = ogm.model("User");

@Injectable()
export class OgmService {
  private ogm: typeof OGM;

  constructor() {
    this.ogm = new OGM({ typeDefs, driver: driver() });
  }

  // TODO: use enum
  getModel(model: string) {
    return this.ogm.model(model);
  }

  // TODO: not used anymore
  async getCustomer(username: string) {
    const Customer = this.ogm.model('Customer');
    const [existing] = await Customer.find({
      where: {
        username,
      },
    });

    if (!existing) {
      throw new Error(`can't found customer with username ${username}!`);
    };

    return existing;
  }
}
