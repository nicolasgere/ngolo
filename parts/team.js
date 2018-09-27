module.exports = {
    schema: `
    type Team {
        members: [Member]
        name: String
      }
    type Member {
        user: User
        role: String
      }
    `,
    resolvers: {
        Team: {
            async members(root, args, { db, user }) {
                if (!user) throw new AuthenticationError('must authenticate');
                return db.members.find({team:root._id}).toArray()
            },
        },
        Member:{
            async user(root, args, { db, user }) {
                if (!user) throw new AuthenticationError('must authenticate');
                return db.users.findOne({_id:root.user})
            },
        }
    },

}