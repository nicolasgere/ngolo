const { ApolloServer, gql } = require('apollo-server');
const parts = require('./parts');
const mutations = require('./mutations');
const MongoClient = require('mongodb').MongoClient;
const {
    DateTime,
    NonPositiveInt,
    PositiveInt,
    NonNegativeInt,
    NegativeInt,
    NonPositiveFloat,
    PositiveFloat,
    NonNegativeFloat,
    NegativeFloat,
    EmailAddress,
    URL,
    PhoneNumber,
    PostalCode,
} = require('@okgrow/graphql-scalars');
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'ngolo';


const schema = `scalar DateTime

scalar EmailAddress

scalar NegativeFloat

scalar NegativeInt

scalar NonNegativeFloat

scalar NonNegativeInt

scalar NonPositiveFloat

scalar NonPositiveInt

scalar PhoneNumber

scalar PositiveFloat

scalar PositiveInt

scalar PostalCode

scalar RegularExpression

scalar UnsignedFloat

scalar UnsignedInt

scalar URL ` + parts.map((x => x.schema)).join(' ') + `type Mutation { ${mutations.map((x => x.schema)).join(' ')} }`
const typeDefs = gql(schema);

var resolvers = {
    DateTime,

    NonPositiveInt,
    PositiveInt,
    NonNegativeInt,
    NegativeInt,

    NonPositiveFloat,
    PositiveFloat,
    NonNegativeFloat,
    NegativeFloat,

    EmailAddress,
    URL,

    PhoneNumber,
    PostalCode
}
var mutationsR = {}
mutations.forEach(x => {
    mutationsR = { ...mutationsR, ...x.mutation }
})
parts.forEach((x => {
    resolvers = { ...resolvers, ...x.resolvers, Mutation: mutationsR }
}))



MongoClient.connect(url, function (err, client) {

    const dbMongo = client.db(dbName);
    const db = {
        users: dbMongo.collection('users'),
        tokens: dbMongo.collection('tokens')
    }
    db.users.ensureIndex("email", { unique: true }, () => { })
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async (ctx) => {
            ctx.db = db;
            ctx.user = null;
            if (ctx.req.headers.authorization) {
                const token = await db.tokens.findOne({ token: ctx.req.headers.authorization })
                if (token) ctx.user = token.user
            }
            return ctx
        },
    });


    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`)
    });
});
