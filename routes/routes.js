var express = require("express")
var app = express()
var router = express.Router()
var UserController = require("../controllers/UserController")
var CompanyController = require("../controllers/CompanyController")
var UserAuth = require("../middleware/UserAuth")
var PlaceController = require("../controllers/PlaceController")


router.post("/user", UserController.create)
router.get("/user", UserAuth, UserController.all)
router.get("/user/:id", UserAuth, UserController.findById)
router.put("/user/:id", UserAuth, UserController.update)
router.delete("/user/:id", UserAuth, UserController.delete)
router.post("/login", UserController.login)
router.get("/check-token", UserController.checkToken)

router.post("/company", UserAuth, CompanyController.create)
router.get("/company", UserAuth, CompanyController.all)
router.get("/company/:id", UserAuth, CompanyController.findById)
router.put("/company/:id", UserAuth, CompanyController.update)
router.delete("/company/:id", UserAuth, CompanyController.delete)

router.post("/place", UserAuth, PlaceController.create)
router.get("/place", UserAuth, PlaceController.all)
router.get("/place/:id", UserAuth, PlaceController.findById)
router.put("/place/:id", UserAuth, PlaceController.update)
router.delete("/place/:id", UserAuth, PlaceController.delete)

module.exports = router