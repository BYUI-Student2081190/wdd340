// Needed Resources
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver Managment view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account_management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver Registration view
* *************************************** */
async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver Account Update view
* *************************************** */
async function buildAccountUpdate(req, res, next) {
  const account_id = parseInt(req.params.accountId)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/account-update", {
      title: "Update Information",
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
  })
}

/* ****************************************
*  Deliver employee-management view
* *************************************** */
async function buildEmployeeManagement(req, res, next) {
  let nav = await utilities.getNav()
  const accountData = await accountModel.getEmployeeAccounts()
  const employeeJobData = await accountModel.getEmployeeData()
  let needsJobData = accountData
  // Use join table to get this list
  let hasJobData = await accountModel.getAllEmployeeDataByAccountId()

  // Find those accounts that need employee data put into them
  if (employeeJobData.length > 0) {
    employeeJobData.forEach(employee => {
      let find = employee.account_id
      let removedObject = needsJobData.find(account => account.account_id === find)
      // Now remove the object from the other array
      let removeIndex = needsJobData.indexOf(removedObject)

      needsJobData.splice(removeIndex, 1)
    })
  } // Else do nothing, because this case only happens if we have stuff in the table.

  // Now call on utilities to set up the html for the view
  const needsJobDataGrid = await utilities.buildNeedsJobData(needsJobData)
  const hasJobDataGrid = await utilities.buildHasJobData(hasJobData)

  // Now render the view
  res.render("account/employee-management", {
    title: "Employee Management",
    nav,
    errors: null,
    needsJobData: needsJobDataGrid,
    employeeJobData: hasJobDataGrid,
  })
}

/* ****************************************
*  Deliver Employee Data view
* *************************************** */
async function buildEmployeeDataView(req, res, next) {
  const account_id = parseInt(req.params.accountId)
  let nav = await utilities.getNav()
  const data = await accountModel.getEmployeeDataByAccountId(account_id)
  const employeeGrid = await utilities.buildEmployeeGrid(data)

  // Now render the view
  res.render("account/employee-view-data", {
    title: "Job Information",
    nav,
    errors: null,
    employeeGrid,
  })
}

/* ****************************************
*  Deliver Employee Data Add view
* *************************************** */
async function buildEmployeeAddDataView(req, res, next) {
  const account_id = parseInt(req.params.accountId)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)

  // Now render the view
  res.render("account/employee-add-data", {
    title: "Add Employee Data",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_id: account_id,
  })
}

/* ****************************************
*  Deliver Employee Data Update view
* *************************************** */
async function buildEmployeeUpdateDataView(req, res, next) {
  const employee_id = parseInt(req.params.employeeId)
  let nav = await utilities.getNav()
  const employeeData = await accountModel.getEmployeeDataById(employee_id)
  const accountData = await accountModel.getAccountById(employeeData.account_id)

  // Now render the view
  res.render("account/employee-edit-data", {
    title: "Edit Employee Data",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    employee_title: employeeData.employee_title,
    employee_description: employeeData.employee_description,
    employee_salary: employeeData.employee_salary,
    employee_shiftstart: employeeData.employee_shiftstart,
    employee_shiftend: employeeData.employee_shiftend,
    employee_shiftdays: employeeData.employee_shiftdays,
    employee_id: employeeData.employee_id,
  })
}

/* ****************************************
*  Deliver Employee Data Delete view
* *************************************** */
async function buildEmployeeDeleteDataView(req, res, next) {
  const employee_id = parseInt(req.params.employeeId)
  let nav = await utilities.getNav()
  const employeeData = await accountModel.getAccountDataByEmployeeId(employee_id)

  // Now render the view
  res.render("account/employee-delete-data", {
    title: "Delete Employee Data",
    nav,
    errors: null,
    account_firstname: employeeData.account_firstname,
    account_lastname: employeeData.account_lastname,
    employee_title: employeeData.employee_title,
    employee_description: employeeData.employee_description,
    employee_salary: employeeData.employee_salary,
    employee_shiftstart: employeeData.employee_shiftstart,
    employee_shiftend: employeeData.employee_shiftend,
    employee_shiftdays: employeeData.employee_shiftdays,
    employee_id: employeeData.employee_id,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword,
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
}

/* ***************************************
 * Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   req.flash("") // Added to prevent a bug that would send the 'log in' flash to the account view when a user already logged in
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
}

/* ****************************************
*  Process Update Information
* *************************************** */
async function accountUpdateInformation(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if (updateResult) {
    // Create array of our updated data by calling the db
    const accountData = await accountModel.getAccountById(account_id)
    // Remove the password to keep it safe
    delete accountData.account_password
    // Clear old cookie
    res.clearCookie("jwt")
    // Create new one with new information so we can use it throughout the site
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    if(process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
  
    // This is the last step of the action
    req.flash(
      "notice",
      `Congratulations, you\'re information has been updated.`
    )
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render(`account/update-information/${account_id}`, {
      title: "Update Information",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
*  Process Update Password
* *************************************** */
async function accountUpdatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.updateAccountPassword(
    account_id,
    hashedPassword,
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re password has been updated.`
    )
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/account-update", {
      title: "Registration",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
*  Process Employee Data
* *************************************** */
async function addEmployeeData(req, res, next) {
  let nav = await utilities.getNav()
  const { employee_title, employee_description, employee_salary, employee_shiftstart, employee_shiftend, employee_shiftdays, account_id } = req.body
  const data = await accountModel.getAccountById(account_id)

  // Add it to the db
  const result = await accountModel.addEmployeeData(
    employee_title,
    employee_description,
    employee_salary,
    employee_shiftstart,
    employee_shiftend,
    employee_shiftdays,
    account_id
  )

  // Result of if we failed or succeeded
  if (result) {
    req.flash("message", `Successfully added employee data to ${data.account_firstname}'s account.`)
    res.redirect("/account/employee-management")
  } else {
    req.flash("notice", "Sorry the information could not be added.")
    res.status(501).render("account/employee-add-data", {
      title: "Add Employee Data",
      nav,
      errors: null,
      account_firstname: data.account_firstname,
      account_lastname: data.account_lastname,
      employee_title,
      employee_description,
      employee_salary,
      employee_shiftstart,
      employee_shiftend,
      employee_shiftdays,
      account_id,
    })
  }
}

/* ****************************************
*  Update Employee Data
* *************************************** */
async function editEmployeeData(req, res, next) {
  let nav = await utilities.getNav()
  const { employee_title, employee_description, employee_salary, employee_shiftstart, employee_shiftend, employee_shiftdays, employee_id } = req.body
  const accountData = await accountModel.getAccountDataByEmployeeId(employee_id)

  // Update the db
  const updateResult = await accountModel.editEmployeeData(
    employee_title, 
    employee_description, 
    employee_salary, 
    employee_shiftstart, 
    employee_shiftend, 
    employee_shiftdays, 
    employee_id)
  
  if (updateResult) {
    req.flash("message", `Successfully updated ${accountData.account_firstname}'s job data.`)
    res.redirect("/account/employee-management")
  } else {
    req.flash("notice", `Sorry ${accountData.account_firstname}'s data could not be updated.`)
    res.status(501).render("account/employee-edit-data", {
      title: "Edit Employee Data",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      employee_title,
      employee_description,
      employee_salary,
      employee_shiftstart,
      employee_shiftend,
      employee_shiftdays,
      employee_id,
    })
  }
}

/* ****************************************
*  Delete Employee Data
* *************************************** */
async function deleteEmployeeData(req, res, next) {
  let nav = await utilities.getNav()
  const { employee_title, employee_description, employee_salary, employee_shiftstart, employee_shiftend, employee_shiftdays, employee_id } = req.body
  const data = await accountModel.getAccountDataByEmployeeId(employee_id)

  // Delete the data from the db
  const deleteResult = await accountModel.deleteEmployeeData(employee_id)

  if (deleteResult) {
    req.flash("message", `Successfully deleted ${data.account_firstname}'s job data.`)
    res.redirect("/account/employee-management")
  } else {
    req.flash("notice", `Sorry ${data.account_firstname}'s data could not be deleted.`)
    res.status(501).render("account/employee-delete-data", {
      title: "Delete Employee Data",
      nav,
      errors: null,
      account_firstname: data.account_firstname,
      account_lastname: data.account_lastname,
      employee_title,
      employee_description,
      employee_salary,
      employee_shiftstart,
      employee_shiftend,
      employee_shiftdays,
      employee_id,
    })
  }
}

/* ****************************************
*  Log out
* *************************************** */
async function accountLogout(req, res, next) {
  // Remove the cookie
  res.clearCookie("jwt")
  // Head back to the home page
  res.redirect("/")
}

module.exports = {buildLogin, buildRegistration, buildAccountManagement, buildAccountUpdate, registerAccount, accountLogin, accountUpdateInformation, accountUpdatePassword, accountLogout, buildEmployeeManagement, buildEmployeeAddDataView, addEmployeeData, buildEmployeeUpdateDataView, editEmployeeData, buildEmployeeDeleteDataView, deleteEmployeeData, buildEmployeeDataView}