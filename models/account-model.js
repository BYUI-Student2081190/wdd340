const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for email with same id
 * ********************* */
async function checkExistingEmailWithSameId(account_id, account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    let test = email.rows[0]
    if (test != null && test.account_email === account_email) {
      if (test.account_id === parseInt(account_id)) {
        return false // This is a ok
      } else {
        return true // There is another email that does not have a matching id
      }
    } else {
      return false
    }
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Get account by email
* *************************** */
async function getAccountByEmail (account_email) {
  try{
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
*   Obtain Account data from account_id
* *************************** */
async function getAccountById(account_id) {
  try{
    const sql = "SELECT * FROM account WHERE account_id = $1"
    const dataResult = await pool.query(sql, [account_id])
    return dataResult.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Update account info
* *************************** */
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email){
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Update password
* *************************** */
async function updateAccountPassword(account_id, account_password) {
  try {
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    return await pool.query(sql, [account_password, account_id])
  } catch (error) {
    return error.message
  }
}

module.exports = {registerAccount, updateAccountInfo, checkExistingEmail, getAccountByEmail, getAccountById, checkExistingEmailWithSameId, updateAccountPassword}