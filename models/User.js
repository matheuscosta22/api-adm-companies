var knex = require("../database/connection")
var bcrypt = require("bcrypt")
const UserController = require("../controllers/UserController")
const axios = require('axios')
const { response } = require("express")
var jwt = require("jsonwebtoken")
var secret = require("../jwt/secret")

class User {

    async all() {
        try {
            var result = await knex.select(["id", "name", "email", "zipcode", "number", "street", "neighborhood", "city", "state", "id_company", "id_place"]).from("users")
            if (result.length > 0) {
                return result
            } else {
                return []
            }
        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }
    }

    async findById(id) {
        try {
            var dataAddress
            var result = await knex.select(["id", "name", "email", "zipcode", "number", "street", "neighborhood", "city", "state", "id_company", "id_place"]).where({ id: id }).from("users")
            if (result.length !== []) {
                return result[0]
            } else {
                return { status: false, err: "user does not exist" }
            }

        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }

    }

    async create(name, email, zipcode, number, password, id_company, id_place) {
        try {
            var address = await axios.get(`https://viacep.com.br/ws/${zipcode}/json/`).then(res => {
                var { logradouro, bairro, localidade, uf } = res.data
                this.dataAddress = [logradouro, bairro, localidade, uf]
            }).catch(err => {
                return false
            })

            if (this.dataAddress !== undefined) {
                var hash = await bcrypt.hash(password, 10)

                await knex.insert({ name, email, zipcode, number, password: hash, street: this.dataAddress[0], neighborhood: this.dataAddress[1], city: this.dataAddress[2], state: this.dataAddress[3], id_company, id_place }).table("users")
                return { status: true }
            } else {
                return { status: false, err: "invalid zipcode" }
            }
        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }
    }

    async update(id, name, email, number, id_company, id_place) {
        try {
            var user = await this.findById(id)
            if (user !== undefined) {
                var editUser = {}

                if (email !== undefined) {
                    if (email !== user.email) {
                        var result = await this.testEmail(email)
                        if (result == false) {
                            editUser.email = email

                        } else {
                            return { status: false, err: "email already registered" }
                        }
                    }
                }

                if (name !== undefined) {
                    editUser.name = name
                }

                if (number !== undefined) {
                    editUser.number = number
                }

                if (id_company !== undefined) {
                    editUser.id_company = id_company
                }

                if (id_place !== undefined) {
                    editUser.id_place = id_place
                }
                
                    try {
                        await knex.update(editUser).where({ id: id }).from("users")
                        return { status: true }

                    } catch (err) {
                        return { status: false, err: err }
                    }
                } else {
                    return { status: false, err: "invalid zipcode" }
                }

        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }

    }

    async delete(id) {
        try {
            var user = await this.findById(id)
            if (user !== undefined) {
                try {
                    await knex.delete().where({ id: id }).from("users")
                    return { status: true }
                } catch (err) {
                    return { status: false, err: err }
                }
            } else {
                return { status: false, err: "The user does not exist" }
            }
        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }
    }

    async login(email, password) {

        var user = await knex.select(["id", "name", "email", "password"]).where({ email: email }).from("users")

        if (user.length > 0) {
            var result = await bcrypt.compare(password, user[0].password)
            if (result) {
                var token = jwt.sign({ email: user[0].email }, secret)
                return { status: true, token: token }
            } else {
                return { status: false, err: "invalid credentials" }
            }
        } else {
            return { status: false, err: "invalid credentials" }
        }

    }

    async testEmail(email) {
        try {

            var result = await knex.select("*").from("users").where({ email: email })

            if (result.length > 0) {
                return true
            } else {
                return false
            }
        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }
    }


}

module.exports = new User()