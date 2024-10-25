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
// Route to view employee data
router.get("/employee-view/:accountId", utilities.checkAccountType, utilities.handleErrors(accController.buildEmployeeDataView));
// Route to employee management
router.get("/employee-management", utilities.checkIfAdmin, utilities.handleErrors(accController.buildEmployeeManagement));
// Route to build employee data add view
router.get("/employee-add/:accountId", utilities.checkIfAdmin, utilities.handleErrors(accController.buildEmployeeAddDataView));
// Route to build employee data update view
router.get("/employee-edit/:employeeId", utilities.checkIfAdmin, utilities.handleErrors(accController.buildEmployeeUpdateDataView));
// Route to build employee data delete view
router.get("/employee-delete/:employeeId", utilities.checkIfAdmin, utilities.handleErrors(accController.buildEmployeeDeleteDataView));

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
// Process the add employee data post
router.post(
    "/employee-add",
    regValidate.addEmployeeDataRules(),
    regValidate.checkAddEmployeeData,
    utilities.handleErrors(accController.addEmployeeData)
);
// Process the update employee data post
router.post(
    "/employee-edit",
    regValidate.editEmployeeDataRules(),
    regValidate.checkEditEmployeeData,
    utilities.handleErrors(accController.editEmployeeData)
);
// Process the delete employee data post
router.post(
    "/employee-delete",
    utilities.handleErrors(accController.deleteEmployeeData)
)

module.exports = router;