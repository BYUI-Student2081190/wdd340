// Only need the export varible
const testErrCont = {}

/* ***************************
 *  Trigger a 500 error
 * ************************** */
testErrCont.triggerError = async function(req) {
    // Just throw an error
    const errorNum = req.params.errorNum
    let err = Error("I blew up...")
    err.name = errorNum

    throw(err)
}

module.exports = testErrCont