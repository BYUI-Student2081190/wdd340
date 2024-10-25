const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    console.error("model error: " + error)
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
    console.error("model error: " + error)
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
    console.error("model error: " + error)
  }
}

/* *****************************
*   Get accounts with the type Employee
* *************************** */
async function getEmployeeAccounts() {
  try {
    const sql = "SELECT * FROM public.account WHERE account_type = 'Employee'"
    let data = await pool.query(sql)
    return data.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Get employee data by account_id
* *************************** */
async function getEmployeeDataByAccountId(account_id) {
  try {
    const sql = 
    `SELECT * FROM public.employee AS e
    JOIN public.account AS a
    ON e.account_id = a.account_id
    WHERE e.account_id = $1`
    let data = await pool.query(sql, [account_id])
    return data.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Get accout data by employee_id
* *************************** */
async function getAccountDataByEmployeeId(employee_id) {
  try {
    const sql = 
    `SELECT * FROM public.employee AS e
    JOIN public.account AS a
    ON e.account_id = a.account_id
    WHERE e.employee_id = $1`
    let data = await pool.query(sql, [employee_id])
    return data.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Get all employee data by account_id
* *************************** */
async function getAllEmployeeDataByAccountId() {
  try {
    const sql = 
      `SELECT * FROM public.employee AS e 
      JOIN public.account AS a 
      ON e.account_id = a.account_id`
    let data = await pool.query(sql)
    return data.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Get employee data
* *************************** */
async function getEmployeeData() {
  try {
    const sql = "SELECT * FROM public.employee"
    let data = await pool.query(sql)
    return data.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Get employee data by employee_id
* *************************** */
async function getEmployeeDataById(employee_id) {
  try {
    const sql = "SELECT * FROM public.employee WHERE employee_id = $1"
    let data = await pool.query(sql, [employee_id])
    return data.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Check to see if data already exsists for employee using account_id
* *************************** */
async function checkEmployeeData(account_id) {
  try {
    const sql = "SELECT * FROM public.employee WHERE account_id = $1"
    const matching = await pool.query(sql, [account_id])
    return matching.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Add employee data
* *************************** */
async function addEmployeeData(employee_title, employee_description, employee_salary, employee_shiftstart, employee_shiftend, employee_shiftdays, account_id) {
  try {
    const sql = "INSERT INTO public.employee (employee_title, employee_description, employee_salary, employee_shiftstart, employee_shiftend, employee_shiftdays, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"
    return await pool.query(sql, [employee_title, employee_description, employee_salary, employee_shiftstart, employee_shiftend, employee_shiftdays, account_id])
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* *****************************
*   Update employee data
* *************************** */
async function editEmployeeData(employee_title, employee_description, employee_salary, employee_shiftstart, employee_shiftend, employee_shiftdays, employee_id) {
  try {
    const sql = "UPDATE public.employee SET employee_title = $1, employee_description = $2, employee_salary = $3, employee_shiftstart = $4, employee_shiftend = $5, employee_shiftdays = $6 WHERE employee_id = $7 RETURNING *"
    const data = await pool.query(sql, [employee_title, employee_description, employee_salary, employee_shiftstart, employee_shiftend, employee_shiftdays, employee_id])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* *****************************
*   Delete employee data
* *************************** */
async function deleteEmployeeData(employee_id) {
  try {
    const sql = "DELETE FROM public.employee WHERE employee_id = $1"
    const data = await pool.query(sql, [employee_id])
    return data
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = {registerAccount, updateAccountInfo, checkExistingEmail, getAccountByEmail, getAccountById, checkExistingEmailWithSameId, updateAccountPassword, getEmployeeAccounts, getEmployeeDataByAccountId, getEmployeeData, getAllEmployeeDataByAccountId, addEmployeeData, checkEmployeeData, getEmployeeDataById, getAccountDataByEmployeeId, editEmployeeData, deleteEmployeeData}