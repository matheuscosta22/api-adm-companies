var bodyParser = require('body-parser')
var express = require("express")
var app = express()
var router = require("./routes/routes")

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use("/api", router);

app.listen(8686, () => {
    console.log("Server on")
});
