//https://cwe.mitre.org/data/definitions/135.html
const getPotentialMitigations = require('./getPotentialMitigations')
const findFunctions = require('./findFunctions')
const isComment = require('../comment/isComment')

let issueNumber = 135

const cwe_135 = (data, comments) => {

    let errorsFound = findFunctions(data, ['strlen', 'wcslen'])
        .filter(single => !isComment(single.lineNumber, comments.comments.lineComments, comments.comments.blockComments))


    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line the command strlen or wcslen was used: ${errorsFound.map(single => `in line ${single.lineNumber}`).join(", ")}`,
        "lineNumbers": errorsFound.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_135