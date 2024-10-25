// Required Resources
const utilities = require("./index")
const { body, validationResult } = require("express-validator")
// validate object
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be a string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 1})
        .withMessage("Please provide a first name."), // on error this message is sent.
        
        // lastname is required and must be a string
        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 2})
        .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannont already exisit in the DB
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
          }
        }),

        // password is required and must be strong password
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/*  **********************************
  *  Update Data Validation Rules
  * ********************************* */
validate.updateAccountRules = () => {
  let account_id = null
  return [
      // id pulled through just to obtain for use in the email check
      body("account_id")
      .custom(async (accountId) => {
        account_id = accountId
      }),

      // firstname is required and must be a string
      body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({min: 1})
      .withMessage("Please provide a first name."), // on error this message is sent.
      
      // lastname is required and must be a string
      body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({min: 2})
      .withMessage("Please provide a last name."), // on error this message is sent.

      // valid email is required
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmailWithSameId(account_id, account_email)
        if (emailExists){
          throw new Error("Email exists. Please use a different email.")
        }
      }),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to Update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/account-update", {
      errors,
      title: "Update Information",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
  return [
      // valid email is required and cannont already exisit in the DB
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

      // password is required and must be strong password
      body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
  *  Password Update rules
  * ********************************* */
validate.passwordUpdateRules = () => {
  return [
      // password is required and must be strong password
      body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to Update (Password)
 * ***************************** */
validate.checkUpdateDataPassword = async (req, res, next) => {
  const { account_id } = req.body
  const data = await accountModel.getAccountById(account_id)
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/account-update", {
      errors,
      title: "Update Information",
      nav,
      account_id,
      account_firstname: data.account_firstname,
      account_lastname: data.account_lastname,
      account_email: data.account_email,
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to add-employee data
 * ***************************** */
validate.checkAddEmployeeData = async (req, res, next) => {
  const { employee_title, employee_description, employee_salary, employee_shiftstart, employee_shiftend, employee_shiftdays, account_id  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let data = await accountModel.getAccountById(account_id)
    res.render("account/employee-add-data", {
      title: "Add Employee Data",
      nav,
      errors,
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
    return
  }
  next()
}

/*  **********************************
  *  Add Employee Data Validation Rules
  * ********************************* */
 validate.addEmployeeDataRules = () => {
  return [
    
    // Validate employee_title
    body("employee_title")
    .trim()
    .notEmpty()
    .withMessage("Please enter a job title."),

    body("employee_description")
    .trim()
    .notEmpty()
    .withMessage("Please enter a job description."),

    body("employee_salary")
    .trim()
    .notEmpty()
    .withMessage("Please enter the job salary.")
    .isNumeric()
    .withMessage("Salary must be a whole number, not a string or decimal.")
    .custom(async (employee_salary) => {
      if (!(employee_salary > 0 && employee_salary <= 9999999)) {
        throw new Error("Salary must be between 0 and 9999999.")
      }
    }),

    body("employee_shiftstart")
    .trim()
    .notEmpty()
    .withMessage("Please enter the starting shift time."),

    body("employee_shiftend")
    .trim()
    .notEmpty()
    .withMessage("Please enter the ending time of the shift."),

    body("employee_shiftdays")
    .trim()
    .notEmpty()
    .withMessage("Please enter the work days of the shift."),

    body("account_id")
    .custom(async (account_id) => {
      // This is in place to double check to see if one already exsists in the
      // db. This will almost never ever pop up unless a person is trying to add duplicate data to
      // the table.
      const isthere = await accountModel.checkEmployeeData(account_id)

      if (isthere) {
        throw new Error("This action could not be done because this account already has employee data associated with it. Please seek help from a site manager.")
      }
    }),
  ]
}

/* ******************************
 * Check data and return errors or continue to edit-employee data
 * ***************************** */
validate.checkEditEmployeeData = async (req, res, next) => {
  const { employee_title, employee_description, employee_salary, employee_shiftstart, employee_shiftend, employee_shiftdays, employee_id  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let employeeData = await accountModel.getEmployeeDataById(employee_id)
    let data = await accountModel.getAccountById(employeeData.account_id)
    res.render("account/employee-edit-data", {
      title: "Edit Employee Data",
      nav,
      errors,
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
    return
  }
  next()
}

/*  **********************************
  *  Edit Employee Data Validation Rules
  * ********************************* */
validate.editEmployeeDataRules = () => {
  return [
    
    // Validate employee_title
    body("employee_title")
    .trim()
    .notEmpty()
    .withMessage("Please enter a job title."),

    body("employee_description")
    .trim()
    .notEmpty()
    .withMessage("Please enter a job description."),

    body("employee_salary")
    .trim()
    .notEmpty()
    .withMessage("Please enter the job salary.")
    .isNumeric()
    .withMessage("Salary must be a whole number, not a string or decimal.")
    .custom(async (employee_salary) => {
      if (!(employee_salary > 0 && employee_salary <= 9999999)) {
        throw new Error("Salary must be between 0 and 9999999.")
      }
    }),

    body("employee_shiftstart")
    .trim()
    .notEmpty()
    .withMessage("Please enter the starting shift time."),

    body("employee_shiftend")
    .trim()
    .notEmpty()
    .withMessage("Please enter the ending time of the shift."),

    body("employee_shiftdays")
    .trim()
    .notEmpty()
    .withMessage("Please enter the work days of the shift."),

  ]
}

module.exports = validate