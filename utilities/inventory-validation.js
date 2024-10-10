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

module.exports = validate