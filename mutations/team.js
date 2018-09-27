var { AuthenticationError } = require('apollo-server');

module.exports = {
    schema: `
        teamCreation(
          name: String
        ): Boolean

        teamInvite(
            email: String,
            teamId: String
          ): Boolean
    `,

    mutation: {
        teamCreation: async (root, { name }, { db, user }) => {
            if (!user) throw new AuthenticationError('must authenticate');

            const team = await db.teams.insertOne({ name })

            const member = await db.members.insertOne({ user, role: "admin", team: team.insertedId })

            return true
        },
        teamInvite: async (root, { email, teamId }, { db, user }) => {
            if (!user) throw new AuthenticationError('must authenticate');

            const team = await db.members.findOne({ team: ObjectId(id), user: user })

            return true
        },

    }

}