# NOTES

> TODO: cleanup NOTES and KeyCloak stuff

> NOTE: project started from `nestjs-oficial-repo/sample/12-graphql-schema-first`

## Add nest-keycloak-connect

- [nest-keycloak-connect npm](https://www.npmjs.com/package/nest-keycloak-connect)
- [nest-keycloak-connect repo](https://github.com/ferrerojosh/nest-keycloak-connect)
- [example app](https://github.com/ferrerojosh/nest-keycloak-connect/tree/5544b4d06a87dd0c71d47075e4a3043f4f0e89d7/example)

```shell
$ npm install nest-keycloak-connect --save
peer @nestjs/common@"^7.0.3" from nest-keycloak-connect@1.6.1

$ git clone https://github.com/ferrerojosh/nest-keycloak-connect.git
```

get project version from `starter/package.json`, ex `8.0.2`

```json
  "dependencies": {
    "@nestjs/common": "8.0.2",
```

and and replace 7.0.3 in `nest-keycloak-connect/package.json`

```json
  "peerDependencies": {
    "@nestjs/common": "^7.0.3",
  },
  "devDependencies": {
    "@nestjs/common": "^7.0.3",
    "@nestjs/core": "^7.0.3",
  }
}
```

```shell
$ rm nest-keycloak-connect/package-lock.json
$ rm starter/package-lock.json
$ cd starter
$ npm i ../nest-keycloak-connect/
$ npm i
```

```json
  "dependencies": {
    "nest-keycloak-connect": "file:../nest-keycloak-connect",
  },
```

donw now we have dependency installed

## Fix all package problems updating all nest-keycloak-connect to new versions

update all packages to new versions `nest-keycloak-connect/package.json`

```shell
$ cd nest-keycloak-connect
$ npm i
$ cd starter
$ npm i
```

> now it build

## Fix module dependecies first

```typescript
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
  PolicyEnforcementMode,
  TokenValidation
} from 'nest-keycloak-connect';
```

Cannot find module 'nest-keycloak-connect' or its corresponding type declarations.ts(2307)

```shell
$ cd nest-keycloak-connect
$ npm run build
```

> done now we have folder `nest-keycloak-connect/dist`

> the trick is installing from dist folder with

```shell
$ cd starter
$ npm i ../nest-keycloak-connect/dist
```

## register the module in app.module.ts

get code from example at `nest-keycloak-connect/example/src/app.module.ts`

create `starter/keycloak.json`

```json
{
  "realm": "Demo-Realm",
  "auth-server-url": "https://auth.koakh.com/auth",
  "ssl-required": "external",
  "resource": "nest-api",
  "verify-token-audience": true,
  "credentials": {
    "secret": "f2912fae-a536-4685-a477-b59582bee3cb"
  },
  "confidential-port": 0,
  "policy-enforcer": {}
}
```

```shell
$ npm run start:debug
[Nest] 9313  - 07/12/2021, 8:19:20 PM     LOG [NestFactory] Starting Nest application...
[Nest] 9313  - 07/12/2021, 8:19:20 PM    WARN [KeycloakConnectModule] Token validation is disabled, please only do this on development/special use-cases.
[Nest] 9313  - 07/12/2021, 8:19:20 PM   ERROR [ExceptionHandler] Nest can\'t resolve dependencies of the ResourceGuard (KEYCLOAK_INSTANCE, KEYCLOAK_CONNECT_OPTIONS, KEYCLOAK_LOGGER, ?). Please make sure that the argument Reflector at index [3] is available in the AppModule context.
```

Potential solutions:
- If Reflector is a provider, is it part of the current AppModule?
- If Reflector is exported from a separate @Module, is that module imported within AppModule?
  @Module({
    imports: [ /* the Module containing Reflector */ ]
  })

- [@AuthenticatedUser in GraphQL Resolver · Issue #57 · ferrerojosh/nest-keycloak-connect](https://github.com/ferrerojosh/nest-keycloak-connect/issues/57)
- [Forbidden resource with GraphQL · Issue #38 · ferrerojosh/nest-keycloak-connect](https://github.com/ferrerojosh/nest-keycloak-connect/issues/38)

> Leave keycloak for now

## 

## GraphQL


