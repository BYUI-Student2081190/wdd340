// Needed Resources
const express = require("express")
const router = new express.Router()
const accController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Route to build account - utilities will automatically handle any errors that creep up
router.get("/login", utilities.handleErrors(accController.buildLogin));
// Route to build registration
router.get("/registration", utilities.handleErrors(accController.buildRegistration));
// Route to post registration - register the account just made
router.post('/register', utilities.handleErrors(accController.registerAccount));

module.exports = router;