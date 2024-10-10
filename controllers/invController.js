const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build the vehicle view by using inventory
 * ************************** */
invCont.buildVehicleByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getVehicleDataByInventoryId(inventory_id)
  const grid = await utilities.buildVehicleGrid(data)
  let nav = await utilities.getNav()
  const className = data.inv_make + data.inv_model + data.inv_year
  res.render("./inventory/vehicle", {
    title: className,
    nav,
    grid,
  }) 
}

/* ***************************
 *  Build the managment view
 * ************************** */
invCont.buildManagmentView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
  })
}

/* ***************************
 *  Build the add-classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process add-classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body

  const classResult = await invModel.addClassification(
    classification_name,
  )

  if (classResult) {
    // This is placed here so we can get the updated
    // nav with the new items in it without requiring
    // a page refresh
    let nav = await utilities.getNav()

    req.flash(
      "notice",
      `Congratulations, ${classification_name} has been added!`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
    })
  } else {
    req.flash(
      "notice",
      `Sorry ${classification_name} failed to be added.`
    )
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

module.exports = invCont