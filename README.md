# README

A minimal nestjs starter, to follow graphacademy `intro to graphql & neo4j - building graphql apis using the neo4j graphql library` tutorial

## Important NOTES

Neo4j/BuildingGraphQLAPIsUsingTheNeo4jGraphQLLibrary/schema.graphql
    admin
Neo4j/NestJsGraphqlSchemaFirstNeo4jLibraryStarter/packages/backend/src/schema.graphql
    ROLE_ADMIN

- [Troubleshooting - Neo4j GraphQL Library](https://neo4j.com/docs/graphql-manual/current/troubleshooting/)

- `@neo4j/graphql:*` - Logs all
- `@neo4j/graphql:auth` - Logs the status of authorization header and token extraction, and decoding of JWT
- `@neo4j/graphql:graphql` - Logs the GraphQL query and variables
- `@neo4j/graphql:execute` - Logs the Cypher and Cypher paramaters before execution, and summary of execution

ex add `DEBUG=@neo4j/graphql:auth` to `debug` script

## Launch database and seed data

> bellow steps are only required first time, `MATCH (a) DETACH DELETE a` query can be used more than one time to tearDown/drop database

1. launch neo4j desktop
2. create database
3. clean database and create index's

```cypher
# delete all nodes
MATCH (a) DETACH DELETE a

# create index
CREATE FULLTEXT INDEX bookIndex FOR (n:Book) ON EACH [n.title, n.description]
```

## Config Neo4j driver

edit `.env`

```shell
NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="password"
```

### Project and Dev Environment Setup

### Install dependencies

```shell
# monorepo dependencies
$ npm i
# lerna bootstrap
$ npm run lerna:install
```

### Run Project

```shell
$ npm run pkg:backend:start:dev
# or
$ npm run pkg:backend:start:debug
```

### Seed Database

> required started server, see above commands

1. open `client.http`
2. launch `@name userLogin` mutation to get authentication token
3. launch `@name seedDatabaseCreateBooks` mutation
4. launch `@name seedDatabaseCreateCustomers` mutation
5. launch all other queries and mutations to play with api

### Debug project

launch **Launch backend via NPM** or 
run `npm run pkg:backend:start:debug` and launch **Attach to Backend**

### Test Debugger

create a breakpoint in line `if (!currentUser) {`

```typescript
  async findOneByField(key: string, value: string, currentUser?: CurrentUserPayload): Promise<AuthUser> {
    if (!currentUser) {
      currentUser = c.adminCurrentUser;
    };
```

launch mutation with graphql playground or `client.http`

```gql
mutation userLogin{
  userLogin(loginUserData: {
    username: "admin",
    password: "12345678"
  }) {
    accessToken
  }
}
```

or launch curl

```shell
$ curl --request POST \
  --url https://127.0.0.1:3443/graphql \
  --header 'content-type: application/json' \
  --header 'user-agent: vscode-restclient' \
  --data '{"query":"mutation userLogin($loginUserData: LoginUserInput!) {\n\tuserLogin(loginUserData: $loginUserData) {\n\t\taccessToken\n\t\tuser {\n\t\t\tid\n\t\t\tusername\n\t\t\temail\n\t\t\troles\n\t\t}\n\t}\n}","variables":{"loginUserData":{"username":"admin","password":"12345678"}}}'
```

you must stop at breakpoint
