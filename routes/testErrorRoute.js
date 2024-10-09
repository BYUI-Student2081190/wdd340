// Needed Resources
const express = require("express")
const router = express.Router()
const testErrController = require("../controllers/testErrController")
const utilities = require("../utilities/")

// Route to build 500 error view
router.get("/species/:errorNum", utilities.handleErrors(testErrController.triggerError));

module.exports = router;