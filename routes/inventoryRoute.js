// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validateInv = require("../utilities/inventory-validation")

// Route to build managment view
router.get("/", utilities.handleErrors(invController.buildManagmentView));
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build vehicle view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleByInventoryId));
// Route to build add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));
// Route to build add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Process the classification data
router.post("/add-classification",
    validateInv.classificationRules(),
    validateInv.checkClassificationData, 
    utilities.handleErrors(invController.addClassification)
);
// Process the inventory data
router.post("/add-inventory",
    validateInv.inventoryRules(),
    validateInv.checkInventoryData,
    utilities.handleErrors(invController.addInventoryItem)
);

module.exports = router;