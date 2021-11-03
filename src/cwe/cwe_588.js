//https://cwe.mitre.org/data/definitions/558.html
const getPotentialMitigations = require('./getPotentialMitigations')
const findFunctions = require('./findFunctions')
const isComment = require('../comment/isComment')

let issueNumber = 558

const cwe_588 = (data, comment) => {

    let errorsFound = findFunctions(data, ['getlogin'])
        .filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line the command chroot was used: ${errorsFound.map(single => `in line ${single.lineNumber}`).join(", ")}`,
        "lineNumbers": errorsFound.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_588