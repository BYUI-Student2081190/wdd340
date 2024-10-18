// Needed Resources
const express = require("express")
const router = new express.Router()
const accController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

// Route to build default view - account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildAccountManagement));
// Route to build account - utilities will automatically handle any errors that creep up
router.get("/login", utilities.handleErrors(accController.buildLogin));
// Route to handle account log out
router.get("/logout", utilities.handleErrors(accController.accountLogout));
// Route to build registration
router.get("/register", utilities.handleErrors(accController.buildRegistration));
// Route to update account view
router.get("/update-information/:accountId", utilities.handleErrors(accController.buildAccountUpdate));

// Process the registration data
router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
);
// Process the login attempt
router.post( 
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accController.accountLogin)
);
// Process the Updated info attempt
router.post(
    "/update-information",
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accController.accountUpdateInformation)
);
// Process the Updated password attempt
router.post(
    "/update-password",
    regValidate.passwordUpdateRules(),
    regValidate.checkUpdateDataPassword,
    utilities.handleErrors(accController.accountUpdatePassword)
);

module.exports = router;