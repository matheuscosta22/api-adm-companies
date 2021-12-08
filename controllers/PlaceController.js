var Place = require("../models/Place")
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")
var secret = require("../jwt/secret")

class PlaceController {


    async create(req, res) {
        try {
            var { name, zipcode, number, id_company, id_user_manager } = req.body

            //validation
            if (name == undefined || name == "" || name.length < 5 || typeof (name) !== "string") {
                res.status(422)
                res.json({ err: "invalid name" })
                return
            }

            if (zipcode == undefined || zipcode == "" || zipcode.length < 8 || typeof (zipcode) !== "number") {
                res.status(422)
                res.json({ err: "invalid zipcode" })
                return
            }

            if (number == undefined || number == "" || number.length < 1 || typeof (number) !== "number") {
                res.status(422)
                res.json({ err: "invalid number" })
                return
            }

            if (id_company == undefined && id_company == "" || id_company.length < 1 || typeof (id_company) !== "number") {
                res.status(422)
                res.json({ err: "invalid id_company" })
                return
            }

            if (id_user_manager == undefined && id_user_manager == "" || id_user_manager.length < 1 || typeof (id_user_manager) !== "number") {
                res.status(422)
                res.json({ err: "invalid id_user_manager" })
                return
            }

            var place = await Place.create(name, zipcode, number, id_company, id_user_manager)
            if (place.status !== false) {
                res.status(201)
                res.json("successfully created")
                return
            } else {
                res.status(422)
                res.json(place.err)
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
            var places = await Place.all()
            res.json(places)
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
                var place = await Place.findById(id)

                if (place !== undefined) {
                    res.status(200)
                    res.json(place)
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
            var { name, number, id_user_manager } = req.body
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

            if (number !== undefined && number !== "") {
                if (number.length < 1 || typeof (number) !== "number") {
                    res.status(422)
                    res.json({ err: "invalid number" })
                    return
                }
            }

            if (id_user_manager !== undefined && id_user_manager !== "") {
                if (id_user_manager.length < 1 || typeof (id_user_manager) !== "number") {
                    res.status(422)
                    res.json({ err: "invalid id_user_manager" })
                    return
                }
            }

            var result = await Place.update(id, name, id_user_manager)
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
        var result = await Place.delete(id)
        if (result.status) {
            res.status(200)
            res.json("deleted successfully")
        } else {
            res.status(406)
            res.json(result.err)
        }
    }

}

module.exports = new PlaceController();