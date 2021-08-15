import { AuthController, AuthModule, AuthOptions, AuthService, GqlContext, GqlContextPayload, NEST_GRAPHQL_AUTH_OPTIONS } from '@koakh/nestjs-package-jwt-authentication-graphql';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationError } from 'apollo-server-core';
import { ConnectionParams } from 'subscriptions-transport-ws';
import { configuration, neoSchema } from './common/config';
import { mapKeysToLowerCase } from './common/utils';
import { constants as userConstants } from './user/user.constants';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { neo4jDriver as driver } from './common/config/neo4j.config';
import { OgmService } from './common/modules/ogm/ogm.service';

@Global()
@Module({
  imports: [
    // config module
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
      load: [configuration],
      // envFilePath: '.development.env',
    }),
    // jwt module
    JwtModule.registerAsync({
      useFactory: async (authModuleOptions: AuthOptions) => ({
        secret: authModuleOptions.secret,
        signOptions: {
          expiresIn: authModuleOptions.expiresIn,
        }
      }),
      inject: [NEST_GRAPHQL_AUTH_OPTIONS],
    }),
    // auth module
    AuthModule.registerAsync({
      imports: [AppModule, UserModule],
      inject: [ConfigService, UserService],
      useFactory: async (configService: ConfigService, userService: UserService) => ({
        secret: configService.get<string>('accessTokenJwtSecret'),
        expiresIn: configService.get<string>('accessTokenExpiresIn'),
        refreshTokenJwtSecret: configService.get<string>('refreshTokenJwtSecret'),
        refreshTokenExpiresIn: configService.get<string>('refreshTokenExpiresIn'),
        adminUserPayload: userConstants.adminCurrentUser,
        userService,
      }),
    }),
// TODO:
// project/package modules
// UserModule,
    // graphql
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, AuthService],
      useFactory: async (configService: ConfigService, authService: AuthService) => ({
        // require to pass req for authentication
        context: ({ req, res, payload, connection }: GqlContext) => ({ req, res, payload, connection, driver: driver() }),
        debug: true,
        playground: true,
        installSubscriptionHandlers: true,
        introspection: true,
// TODO:
// this enable code first
// autoSchemaFile: 'schema.gql',
        // this enable neo4j schema first
        schema: neoSchema.schema,
        cors: {
          origin: configService.get<string>('corsOriginReactFrontend'),
          credentials: true,
        },
        subscriptions: {
          // get headers
          onConnect: (connectionParams: ConnectionParams) => {
            // convert header keys to lowercase
            const connectionParamsLowerKeys = mapKeysToLowerCase(connectionParams);
            // get authToken from authorization header
            const authToken: string = ('authorization' in connectionParamsLowerKeys)
              && connectionParamsLowerKeys.authorization.split(' ')[1];
            if (authToken) {
              // verify authToken/getJwtPayLoad
              const jwtPayload: GqlContextPayload = authService.getJwtPayLoad(authToken);
              // the user/jwtPayload object found will be available as context.currentUser/jwtPayload in your GraphQL resolvers
              return { currentUser: jwtPayload.username, jwtPayload, headers: connectionParamsLowerKeys };
            }
            throw new AuthenticationError('authToken must be provided');
          },
        },
      }),
    }),
    // TODO
    // AuthModule,
    // catsModule
    // CatsModule,
    // graphQL
    // GraphQLModule.forRoot({
    //   // typePaths: ['./**/*.graphql'],
    //   // installSubscriptionHandlers: true,
    //   // the trick for the problem of authentication is not passing here the req
    //   context: ({ req }) => ({ driver, req }),
    //   schema: neoSchema.schema,
    //   introspection: true,
    //   playground: true
    //   // tip use `npm run generate-typings`
    //   // @nestjs/graphql package can automatically generate TypeScript definitions from the abstract syntax
    //   // tree (AST). To enable this feature, add the definitions options property when configuring the GraphQLModule.
    //   // definitions: {
    //   //   path: join(process.cwd(), 'src/graphql.schema.ts'),
    //   //   //  By default, all generated TypeScript types are created as interfaces. To generate classes instead, specify the outputAs property with a value of 'class'.
    //   //   outputAs: 'class',
    //   // },
    // }),
  ],
  providers: [
    UserService,
    OgmService,
  ],
  exports: [
    // if we export here JwtModule, we don't need the duplicated code in auth.module
    JwtModule,
    UserService,
    OgmService,
  ],
  controllers: [
    AuthController
  ],
})

export class AppModule { }
