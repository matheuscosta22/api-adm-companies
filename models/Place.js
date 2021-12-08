var knex = require("../database/connection")
var bcrypt = require("bcrypt")
const PlaceController = require("../controllers/PlaceController")
const axios = require('axios')
const { response } = require("express")

class Place {
    
    async all() {
        try {
            var result = await knex.select(["id", "name", "zipcode", "number", "street", "neighborhood", "city", "state", "id_company", "id_user_manager"]).from("places")
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
            var result = await knex.select(["id", "name", "zipcode", "number", "street", "neighborhood", "city", "state", "id_company", "id_user_manager"]).where({ id: id }).from("places")
            if (result.length !== []) {
                return result[0]
            } else {
                return { status: false, err: "place does not exist" }
            }

        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }

    }

    async create(name, zipcode, number, id_company, id_user_manager) {
        try {
            var address = await axios.get(`https://viacep.com.br/ws/${zipcode}/json/`).then(res => {
                var { logradouro, bairro, localidade, uf } = res.data
                this.dataAddress = [logradouro, bairro, localidade, uf]
            }).catch(err => {
                return false
            })
            
            if (this.dataAddress !== undefined) {

                await knex.insert({ name, zipcode, number, street: this.dataAddress[0], neighborhood: this.dataAddress[1], city: this.dataAddress[2], state: this.dataAddress[3], id_company, id_user_manager }).table("places")
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

    async update(id, name, id_company, id_user_manager) {
        try {
            var place = await this.findById(id)
            if (place !== undefined) {
                var editPlace = {}


                if (name !== undefined) {
                    editPlace.name = name
                }


                if (id_company !== undefined) {
                    editPlace.id_company = id_company
                }

                if (id_user_manager !== undefined) {
                    editPlace.id_user_manager = id_user_manager
                }
                
                    try {
                        await knex.update(editPlace).where({ id: id }).from("places")
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

    async delete(id) {
        try {
            var place = await this.findById(id)
            if (place !== undefined) {
                try {
                    await knex.delete().where({ id: id }).from("places")
                    return { status: true }
                } catch (err) {
                    return { status: false, err: err }
                }
            } else {
                return { status: false, err: "The place does not exist" }
            }
        } catch (err) {
            console.log(err)
            res.status(500)
            res.json({ err: "Internal Server Error" })
        }
    }
}

module.exports = new Place()