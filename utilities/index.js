const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
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

module.exports = Util