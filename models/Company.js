var knex = require("../database/connection")
var bcrypt = require("bcrypt")
const CompanyController = require("../controllers/CompanyController")
const axios = require('axios')
const { response } = require("express")

class Company {

    async all() {
        try {
            var result = await knex.select(["id", "name", "cnpj", "description", "zipcode", "number", "street", "neighborhood", "city", "state", "id_user_manager"]).from("companies")
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
            var result = await knex.select(["id", "name", "cnpj", "description", "zipcode", "number", "street", "neighborhood", "city", "state", "id_user_manager"]).where({ id: id }).from("companies")
            if (result.length !== []) {
                return result[0]
            } else {
                return { status: false, err: "company does not exist" }
            }

        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }

    }

    async create(name, cnpj, description, zipcode, number, id_user_manager) {
        try {
            var address = await axios.get(`https://viacep.com.br/ws/${zipcode}/json/`).then(res => {
                var { logradouro, bairro, localidade, uf } = res.data
                this.dataAddress = [logradouro, bairro, localidade, uf]
            }).catch(err => {
                return false
            })

            if (this.dataAddress !== undefined) {

                await knex.insert({ name, cnpj, description, zipcode, number, street: this.dataAddress[0], neighborhood: this.dataAddress[1], city: this.dataAddress[2], state: this.dataAddress[3], id_user_manager }).from("companies")
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

    async update(id, name, cnpj, description, number, id_user_manager) {
        try {
            var company = await this.findById(id)

            if (company !== undefined) {
                var editCompany = {}

                if (name !== undefined) {
                    editCompany.name = name
                }

                if (number !== undefined) {
                    editCompany.number = number
                }
                if (cnpj !== undefined) {
                    editCompany.cnpj = cnpj
                }
                if (description !== undefined) {
                    editCompany.description = description
                }
                if (id_user_manager !== undefined) {
                    editCompany.id_user_manager = id_user_manager
                }

                    try {
                        await knex.update(editCompany).where({ id: id }).from("companies")
                        return { status: true }

                    } catch (err) {
                        return { status: false, err: err }
                    }

            } else {
                return { status: false, err: "The company does not exist" }
            }
        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }

    }

    async delete(id) {
        try {
            var company = await this.findById(id)
            if (company !== undefined) {
                try {
                    await knex.delete().where({ id: id }).from("companies")
                    return { status: true }
                } catch (err) {
                    return { status: false, err: err }
                }
            } else {
                return { status: false, err: "The company does not exist" }
            }
        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }
    }

}

module.exports = new Company()