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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    classificationSelect,
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
    let classificationList = await utilities.buildClassificationList()

    req.flash(
      "notice",
      `Congratulations, ${classification_name} has been added!`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      classificationSelect: classificationList,
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

/* ***************************
 *  Build the add-inventory view
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Item",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Add inventory item
 * ************************** */
invCont.addInventoryItem = async function (req, res) {
  let nav = await utilities.getNav()
  // Also need to add classificationList to prevent errors
  let classificationList = await utilities.buildClassificationList()
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body

  const inventoryResult = await invModel.addItem(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  )

  if (inventoryResult) {
    req.flash(
      "notice",
      `Congratulations, the item has been added!`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      classificationSelect: classificationList,
    })
  } else {
    req.flash(
      "notice",
      `Sorry the item failed to be added.`
    )
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Item",
      nav,
      classificationList,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async (req, res, next) => {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleDataByInventoryId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update inventory item
 * ************************** */
invCont.updateInventoryItem = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_id, inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont