var User = require("../models/User")
const secret = require("../jwt/secret")
var jwt = require("jsonwebtoken")
const res = require("express/lib/response")
const { compareSync } = require("bcrypt")

class UserController {


    async create(req, res) {
        try {
            var { name, email, zipcode, number, password, id_company, id_place } = req.body
            
            //validation
            if (name == undefined || name == "" || name.length < 5 || typeof (name) !== "string") {
                res.status(422)
                res.json( "invalid name" )
                console.log("invalid name")
                return
            }

            if (email == undefined || email == "" || email.length < 7 || typeof (email) !== "string") {
                res.status(422)
                res.json( "invalid email" )
                console.log("invalid email")
                return
            }

            if (zipcode == undefined || zipcode == "" || zipcode.length < 8) {
                res.status(422)
                res.json( "invalid zipcode" )
                console.log("invalid zipcode")
                return
            }

            if (number == undefined || number == "" || number.length < 1) {
                res.status(422)
                res.json( "invalid number" )
                console.log("invalid number")
                return
            }

            if (password == undefined || password == "" || password.length < 8 || typeof (password) !== "string") {
                res.status(422)
                res.json( "invalid passwod" )
                console.log("invalid password")
                return
            }

            if (id_company !== undefined) {
                if (id_company == "" || id_company.length < 1 || typeof (id_company) !== "number") {
                    res.status(422)
                    res.json( "invalid id_comany" )
                    console.log("invalid id_company")
                    return
                }
            } else {
                id_company = null
            }

            if (id_place !== undefined) {
                if (id_place == "" || id_place.length < 1 || typeof (id_place) !== "number") {
                    res.status(422)
                    res.json( "invalid id_plae" )
                    console.log("invalid id_place")
                    return
                }
            } else {
                id_place = null
            }

            var emailExists = await User.testEmail(email)

            if (emailExists) {
                res.status(422)
                res.json({ err: "email already registered" })
                console.log("email already registered")
                return
            }

            var user = await User.create(name, email, zipcode, number, password, id_company, id_place)
            if (user.status !== false) {
                res.status(201)
                res.json("successfully created")
                return
            } else {
                res.status(422)
                res.json(user.err)
                return
            }
        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }
    }


    async all(req, res) {
        try {
            var users = await User.all()
            res.json(users)
        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }
    }


    async findById(req, res) {
        try {
            var id = req.params.id
            if (id !== undefined && typeof (id) !== "number") {
                var user = await User.findById(id)

                if (user !== undefined) {
                    res.status(200)
                    res.json(user)
                } else {
                    res.status(404)
                    res.json("resource not found")
                }
            } else {
                res.status(405)
                res.json({ err: "invalid password" })
            }
        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }
    }

    async update(req, res) {
        try {
            var id = req.params.id
            var { name, email, number } = req.body
            //validation
            if (id == undefined || id == "" || id.length < 1) {
                res.status(422)
                res.json({ err: "invalid id" })
                return
            }

            if (name !== undefined && name !== "") {
                if (name.length < 5 || typeof (name) !== "string") {
                    res.status(422)
                    res.json({ err: "invalid name" })
                    return
                }
            }

            if (email !== undefined && email !== "") {

                var emailExists = await User.testEmail(email)

                if (emailExists) {
                    res.status(422)
                    res.json({ err: "email already registered" })
                    return
                }
                if (email.length < 7 || typeof (email) !== "string") {

                    res.status(422)
                    res.json({ err: "invalid email" })
                    return
                }
            }

            if (number !== undefined && number !== "") {
                if (number.length < 1 || typeof (number) !== "number") {
                    res.status(422)
                    res.json({ err: "invalid number" })
                    return
                }
            }

            if (id_company !== undefined && id_company !== "") {
                if (id_company.length < 1 || typeof (id_company) !== "number") {
                    res.status(422)
                    res.json({ err: "invalid id_company" })
                    return
                }
            }

            if (id_place !== undefined && id_place !== "") {
                if (id_place.length < 1 || typeof (id_place) !== "number") {
                    res.status(422)
                    res.json({ err: "invalid id_place" })
                    return
                }
            }


            var result = await User.update(id, name, email, zipcode, number, id_company, id_place)
            if (result.status == true) {
                res.status(200)
                res.send("updated successfully")
            } else {
                res.status(406)
                res.json(result.err)
            }
        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }
    }

    async delete(req, res) {
        var id = req.params.id
        var result = await User.delete(id)
        if (result.status) {
            res.status(200)
            res.json("deleted successfully")
        } else {
            res.status(406)
            res.json(result.err)
        }
    }

    async login(req, res) {
        var { email, password } = req.body
        var result = await User.login(email, password)
        if (result.status) {
            res.status(200)
            res.json({ token: result.token })
        } else {
            res.status(401)
            res.json("invalid credentials")
        }
        return

    }

    async checkToken(req, res) {
        const authToken = req.headers['authorization']

    if (authToken !== undefined) {
        const bearer = authToken.split(' ')
        var token = bearer[1]
        try {
            jwt.verify(token, secret)

            res.status(200)
            res.send({status: "authorized", name: jwt.verify(token, secret).name, id: jwt.verify(token, secret).id})

        } catch (err) {
            res.status(401)
            res.send({status: "user must be logged"})
        }
    } else {
        res.status(401)
        res.send({status: "user must be logged"})
    }
    }

}

module.exports = new UserController();