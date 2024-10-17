// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validateInv = require("../utilities/inventory-validation")

// Route to build managment view
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagmentView));
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build vehicle view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleByInventoryId));
// Route to build add-classification view
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassificationView));
// Route to build add-inventory view
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventoryView));
// Route to getInventory
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
// Route to build edit-inventory view
router.get("/edit/:inventoryId", utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventoryView));
// Route to build delete-inventory view
router.get("/delete/:inventoryId", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventoryView));

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
// Process the edited inventory data
router.post("/update",
    validateInv.inventoryRules(),
    validateInv.checkUpdateData,
    utilities.handleErrors(invController.updateInventoryItem)
);
// Process the delete data
router.post("/delete", utilities.handleErrors(invController.deleteInventoryItem));

module.exports = router;