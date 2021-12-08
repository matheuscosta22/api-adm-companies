const secret = require("../jwt/secret")
var jwt = require("jsonwebtoken")


module.exports = function (req, res, next) {
    const authToken = req.headers['authorization']

    if (authToken !== undefined) {
        const bearer = authToken.split(' ')
        var token = bearer[1]
        try {
            jwt.verify(token, secret)
            next()

        } catch (err) {
            res.status(401)
            res.send("user must be logged")
        }
    } else {
        res.status(401)
        res.send("user must be logged")
    }
}