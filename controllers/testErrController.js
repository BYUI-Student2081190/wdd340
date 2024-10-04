// Only need the export varible
const testErrCont = {}

/* ***************************
 *  Trigger a 500 error
 * ************************** */
testErrCont.triggerError = async function(req, res, next) {
    // Just throw an error
    try {
        throw new Error('500 error accomplished.')
    } catch (err) { // Then catch it and move on
        next (
            err.status = 500,
            err.message = 'Ooof, looks like the site crashed...' // This tests to see if the server changes the message.
        )
    }
}

module.exports = testErrCont