const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
        const { email, password, username, country, region, profileImg } = req.body
        checkProfileImg = profileImg === ''
            ? 'https://demicog-bikes.s3.amazonaws.com/demicogWEB_WHITE-1612645928534.png'
            : profileImg
        const db = req.app.get('db')

        const [foundUser] = await db.users.check_user(email)
        if (foundUser) {
            return res.status(409).send('EMAIL ALREADY USED')
        }

        const [userNameTaken] = await db.users.check_user(username)
        if (userNameTaken) {
            return res.status(409).send('USERNAME ALREADY TAKEN')
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt)

        const [newUser] = await db.users.register_user({ email, hash, username, country, region, profileImg: checkProfileImg })

        req.session.user = newUser;
        res.status(201).send(req.session.user);
    },
    login: async (req, res) => {
        const { userOrEmail, password } = req.body;
        const db = req.app.get('db');

        const [foundUser] = await db.users.check_user(userOrEmail)

        if (!foundUser) {
            return res.status(400).send('Account not found')
        }

        const authenticated = bcrypt.compareSync(password, foundUser.password)
        if (!authenticated) {
            return res.status(401).send('Password is incorrect')
        }

        delete foundUser.password
        req.session.user = foundUser
        // console.log(req.session.user)
        res.status(202).send(req.session.user)
    },
    logout: async (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },
    getUser: (req, res) => {
        if (!req.session.user) {
            return res.status(404).send('No user is logged in')
        }
        res.status(200).send(req.session.user)
    }
}