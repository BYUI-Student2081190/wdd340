// Required Resources
const utilities = require("./index")
const { body, validationResult } = require("express-validator")
// validate object
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
        // classification_name is required and must be a string
        // also check and see if this classification is already there
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 1})
        .isAlpha()
        .withMessage("Please provide a valid classification name.") // When we error and blow up.
        .custom(async (classification_name) => {
            const classifExsists = await invModel.checkExistingClassification(classification_name)
            if (classifExsists){
                throw new Error("Classification already exists. Please insert a different one.")
            }
        })
    ]
}

/* ******************************
 * Check classification data and return errors or continue to add-classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/*  **********************************
  *  Add Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
        // classification_id
        body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please select a Classification from the list."), // This will trigger if they do not choose anything.

        // inv_make
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please enter the Make."),

        // inv_model
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please enter the Model."),

        // inv_year
        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please enter a Year.")
        .isNumeric()
        .withMessage("Year must be a number.")
        .isLength({min: 4, max: 4})
        .withMessage("A Year must be at least 4 numbers long.")
        .custom(async (inv_year) => {
            const isValid = await invModel.checkIfNumberInRage(inv_year, 1890, 2100)
            if (!isValid) {
                throw new Error("Year must be between 1890 and 2100.")
            }
        }),

        // inv_description
        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please enter a Discription."),

        // inv_image
        body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("Please enter a Image path.")
        .custom(async (inv_image) => {
            const isImage = await invModel.checkIfPathIsImagePath(inv_image)
            const isValid = await invModel.checkIfValidPath(inv_image)
            if (!isImage) {
                throw new Error("Not valid Image path.")
            }
            if (!isValid) {
                throw new Error("Image path not in directory. Please put a different image path.")
            }
        }),

        // inv_thumbnail
        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Please enter a Thumbnail path.")
        .custom(async (inv_thumbnail) => {
            const isImage = await invModel.checkIfPathIsImagePath(inv_thumbnail)
            const isValid = await invModel.checkIfValidPath(inv_thumbnail)
            if (!isImage) {
                throw new Error("Not valid Thumbnail path.")
            }
            if (!isValid) {
                throw new Error("Thumbnail image path not in directory. Please put a different image path.")
            }
        }),

        // inv_price
        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please enter a Price.")
        .isNumeric()
        .withMessage("Price must be a whole number not a decimal or string.")
        .custom(async (inv_price) => {
            const isValid = await invModel.checkIfNumberInRage(inv_price, 0, 999999999)
            if (!isValid) {
                throw new Error("Price must be between 0 and 999,999,999.")
            }
        }),

        // inv_miles
        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please enter the Miles.")
        .isNumeric()
        .withMessage("Miles must be a whole number not a decimal or string.")
        .custom(async (inv_miles) => {
            const isValid = await invModel.checkIfNumberInRage(inv_miles, 0, 999999999)
            if (!isValid) {
                throw new Error("Miles must be between 0 and 999,999,999.")
            }
        }),

        // inv_color
        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please enter a color.")
    ]
}

/* ******************************
 * Check inventory data and return errors or continue to add-inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        // Put this here to prevent a crash
        let classificationList = await utilities.buildClassificationList()
        res.render("./inventory/add-inventory", {
            errors,
            title: "Add Item",
            nav,
            classificationList,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        })
        return
    }
    next()
}

/* ******************************
 * Check inventory data and return errors or continue to edit-inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { classification_id, inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        // Put this here to prevent a crash
        let classificationSelect = await utilities.buildClassificationList(classification_id)
        let invName = `${inv_make} ${inv_model}` 
        res.render("./inventory/edit-inventory", {
            errors,
            title: "Edit " + invName,
            nav,
            classificationList: classificationSelect,
            classification_id,
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
        })
        return
    }
    next()
}

module.exports = validate