var { UserInputError } = require('apollo-server');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var crypto = require('crypto');
module.exports = {
    schema: `
        register(
          email: EmailAddress
          password: String
        ): Boolean

        login(
            email: EmailAddress
            password: String
          ): String
    `,

    mutation: {
        register: async (root, { email, password }, { db }) => {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const res = await db.users.insertOne({ email, password: hashedPassword, confirmed: true })
            return true
        },
        login: async (root, { email, password }, { db }) => {
            const res = await db.users.findOne({ email })
            if (!res) {
                return {}
            }
            const same = await bcrypt.compare(password, res.password);
            if (!same) {
                return {}
            }
            var token = crypto.randomBytes(64).toString('hex');
            await db.tokens.insertOne({ user:res._id, token })
            return token
        },
    }

}