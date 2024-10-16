const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul id="navigation">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on WDD Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the classification list for add-inventory
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
  '<select name="classification_id" id="classificationList" required>'
  classificationList += '<option value="">Choose a Classification</option>'
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += ' selected '
    }
    classificationList += '>' + row.classification_name + '</option>'
  })
  classificationList += '</select>'
  return classificationList
}

/* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildVehicleGrid = async function (vehicle){
  let grid
  if(vehicle != null){
    grid = '<div id="inventory-view">'
    grid += '<div class="inventory-view-sec">'
    grid += '<h2>'
    grid += vehicle.inv_year + ' ' + vehicle.inv_make
    + ' ' + vehicle.inv_model
    grid += '</h2>'
    grid += '<img src="' + vehicle.inv_image + '"'
    + ' alt="Image of' + vehicle.inv_make + ' '
    + vehicle.inv_model + ' on WDD Motors"/>'
    grid += '</div>'
    grid += '<ul class="inventory-view-sec">'
    grid += '<li>'
    grid += '<h3>' + vehicle.inv_make + ' '
    + vehicle.inv_model
    grid += '</h3>'
    grid += '</li>'
    grid += '<li>'
    grid += '<p><strong>Price: $</strong>' + new Intl.NumberFormat('en-US').format(vehicle.inv_price)
    grid += '</p>'
    grid += '</li>'
    grid += '<li>' 
    grid += '<p><strong>Description:</strong> ' + vehicle.inv_description
    grid += '</p>'
    grid += '</li>'
    grid += '<li>' 
    grid += '<p><strong>Color:</strong> '+ vehicle.inv_color
    grid += '</p>'
    grid += '</li>'
    grid += '<li>' 
    grid += '<p><strong>Miles:</strong> ' + vehicle.inv_miles.toLocaleString('en-US')
    grid += '</p>'
    grid += '</li>' 
    grid += '</ul>'
    grid += '</div>'
  } else {
    grid += '<p class="notice"> Sorry, this vehicle cannot be found.'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}

/* ****************************************
* Middleware to check account type using the token
**************************************** */
Util.checkAccountType = (req, res, next) => {
  // Get the current jwt cookie
  const token = req.cookies.jwt

  try{
    // Verify that the token is a valid token and it exsists
    const accountData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    if (accountData.account_type === 'Admin' || accountData.account_type === 'Employee') {
      next() // We are good so the route can just continue
    } else { // If you don't have permission sign in as the proper account_type
      req.flash("notice", "Access denied, please log in as 'Admin' or 'Employee'.")
      res.redirect("/account/login")
    }
  } catch (err) {
    // Redirect to login because token is not valid, or missing meaning they need to log back in
    req.flash("notice", "Session expired. Please log in.")
    res.clearCookie("jwt")
    res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util