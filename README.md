# README

A minimal nestjs/neo4j graphql library starter, to follow graphacademy `intro to graphql & neo4j - building graphql apis using the neo4j graphql library` tutorial

## Project stopped at

currently using only schema first, disabled code first with commented bellow line

```typescript
// autoSchemaFile: 'schema.gql',
```

seems that using nestjs and mix code first and schema first is not a ideomatic way to work with **neo4j graphql library**, is to akward and in the end we can't use dependency injection and nestjs features, opted to start a nodejs project based on neopush project

## Links

- [Intro To GraphQL & Neo4j - Building GraphQL APIs Using The Neo4j GraphQL Library](https://neo4j.com/graphacademy/training-graphql-apis/01-graphql-apis-intro-to-graphql/)

## Links Lib Docs

- [Neo4j GraphQL Library - Neo4j GraphQL Library](https://neo4j.com/docs/graphql-manual/current/)

## Important NOTES

there are two similar projects to follow tutorial, a simple one with nodejs and other with nestjs, nestjs is more like a starter with authentication and lerna, useful if one needs to bootstrap a neo4j graphql based project boilerplate, project repositories are here:

- [TypescriptNodeBuildingGraphQLAPIsUsingTheNeo4jGraphQLLibrary](https://github.com/koakh/TypescriptNodeBuildingGraphQLAPIsUsingTheNeo4jGraphQLLibrary)
- [NestJsGraphqlSchemaFirstNeo4jLibraryStarter](https://github.com/koakh/NestJsGraphqlSchemaFirstNeo4jLibraryStarter)

there are some files in common like

`Neo4j/BuildingGraphQLAPIsUsingTheNeo4jGraphQLLibrary/schema.graphql`
  diferences in user roles: `admin`
`Neo4j/NestJsGraphqlSchemaFirstNeo4jLibraryStarter/packages/backend/src/schema.graphql`
  diferences in user roles: `ROLE_ADMIN`

## Launch database and seed data

> bellow steps are only required first time, `MATCH (a) DETACH DELETE a` query can be used more than one time to tearDown/drop database nodes/relationship's

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
