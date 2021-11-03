//https://cwe.mitre.org/data/definitions/782.html
const getPotentialMitigations = require('./getPotentialMitigations')
const findFunctions = require('./findFunctions')
const isComment = require('../comment/isComment')

let issueNumber = 782

const cwe_782 = (data, comment) => {

    let errorsFound = findFunctions(data, ['ioctl'])

    errorsFound = errorsFound.filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))


    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line the command ioctl could be male used, this vulnerability causes manly problems in the WIN32 environment: ${errorsFound.map(single => `in line ${single.lineNumber}`).join(", ")}`,
        "lineNumbers": errorsFound.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_782