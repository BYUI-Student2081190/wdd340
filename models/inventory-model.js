const pool = require("../database/")
const fs = require("fs")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get specific vehicle based on the inventory_id
 * ************************** */
async function getVehicleDataByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inventory_id]
    )
    return data.rows[0] // Only return the first row for use
  } catch (error) {
    console.error("getvehicledatabyinventoryid" + error)
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try{
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Check for exsisting classification
 * ************************** */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classif = await pool.query(sql, [classification_name])
    return classif.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Check if path is an image path
 * ************************** */
async function checkIfPathIsImagePath(imagePath) {
  if (imagePath.includes("/images/vehicles/")) {
    return true; // No error was found
  } else {
    return false; // Error is there, not an image path
  }
}

/* ***************************
 *  Check to see if image is valid path
 * ************************** */
async function checkIfValidPath(imagePath) {
    let testPath = 'public' + imagePath
    if (fs.existsSync(testPath)) {
      return true; // This is because we are valid!
    } else {
      return false; // If we have an error this does not work 
    }
}

/* ***************************
 *  Add a new item to the Inventory
 * ************************** */
async function addItem (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleDataByInventoryId, addClassification, checkExistingClassification, checkIfPathIsImagePath, checkIfValidPath, addItem};