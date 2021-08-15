import { neo4jDriver as driver } from './neo4j.config';
const { OGM } = require("@neo4j/graphql-ogm");
import { Neo4jGraphQL } from '@neo4j/graphql';
import * as fs from 'fs';
import * as path from 'path';
import { configuration } from './configuration';
import { comparePassword, createJWT, hashPassword } from '../utils';
import { UserRoles } from '../enums';
import { SignInInput, SignUpInput } from '../input-type';
import { constants as c } from '../constants';

const schemaGraphql = '../../schema.graphql';
if (!fs.existsSync(path.join(__dirname, schemaGraphql))) {
  throw new Error(`can't open schemaGraphql: ${schemaGraphql}`);
};
// load GraphQL type definitions from schema.graphql file
export const typeDefs = fs
  .readFileSync(path.join(__dirname, schemaGraphql))
  .toString('utf-8');

// init ogm
const ogm = new OGM({ typeDefs, driver: driver() });
const User = ogm.model(c.graphTypes.USER);

export const mutationResolvers = {
  signUp: async (_source, { signUpInput }: { signUpInput: SignUpInput }) => {
    const [existing] = await User.find({
      where: {
        username: signUpInput.username,
      },
    });

    if (existing) {
      throw new Error(`User with username ${signUpInput.username} already exists!`);
    }
    // [user] don't work may be a typo in documentation, now seems that return a array of created users
    // else error occur `TypeError: (intermediate value) is not iterable`
    const data = await User.create({
      input: [
        {
          ...signUpInput,
          password: await hashPassword(signUpInput.password),
          roles: [UserRoles.ROLE_USER],
          metaData: JSON.stringify(signUpInput.metaData),
        }
      ]
    });

    return await createJWT({
      sub: data.users[0].id,
      username: data.users[0].username,
      roles: data.users[0].roles,
    });
  },
  signIn: async (_source, { signInInput }: { signInInput: SignInInput }) => {
    const [user] = await User.find({
      where: {
        username: signInInput.username,
      },
    });

    if (!user) {
      throw new Error(`User with username ${signInInput.username} not found!`);
    }

    const correctPassword = await comparePassword(signInInput.password, user.password);

    if (!correctPassword) {
      throw new Error(`Incorrect password for user with username ${signInInput.username}!`);
    }

    return await createJWT({
      sub: user.id,
      username: user.username,
      roles: user.roles,
    });
  },
};

// custom Resolvers
const resolvers = {
  // require to us json scalar type
  Mutation: mutationResolvers,
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
