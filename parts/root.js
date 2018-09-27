var ObjectID = require('mongodb').ObjectID
var { AuthenticationError } = require('apollo-server');

module.exports = {
    schema: `
    type Query {
        me: User
      }
    `,
    resolvers: {
        Query: {
            async me(root, args, { db, user }) {
                if (!user) throw new AuthenticationError('must authenticate');
                var res = await db.users.findOne({ "_id": ObjectID(user) })
                return res
            },
        },
    }
}