// Needed Resources
const express = require("express")
const router = express.Router()
const testErrController = require("../controllers/testErrController")

// Route to build 500 error view
router.get("/species/:errorNum", testErrController.triggerError);

module.exports = router;