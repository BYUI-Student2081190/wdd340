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
*  Log out
* *************************************** */
async function accountLogout(req, res, next) {
  let nav = await utilities.getNav()
  // Remove the cookie
  res.clearCookie("jwt")
  // Head back to the home page
  res.redirect("/")
}

module.exports = {buildLogin, buildRegistration, buildAccountManagement, buildAccountUpdate, registerAccount, accountLogin, accountUpdateInformation, accountUpdatePassword, accountLogout}