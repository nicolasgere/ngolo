module.exports = {
    schema: `
    type User {
        email: EmailAddress
        id: String
        confirmed: Boolean
        teams: [Team]
      }
    `,
    resolvers: {
        User: {
            async teams(root, args, { db, user }) {
                if (!user) throw new AuthenticationError('must authenticate');
                var res = await db.members.find({ user })
                var members = await res.toArray();

                return Promise.all(members.map((m) => {
                    return db.teams.findOne({ _id: m.team }).then(t => {
                        return { ...t, myRole: m.role }
                    })
                }))
            },
        },
    },

}